var LS_KEY = 'ups-data';
var $dropMenu = $('[data-drop-menu]');
var $navLinks = $('[data-nav-link]');
var $checkpointTable = $('[data-checkpoint]');
var $checkpointTableBody = $('[data-checkpoint-body]');
var $inputField = $('[data-tracking-number]');
var $mapContainer = $('[data-map-container]');
var $theMap = $('[data-map]');
var $alert = $('[data-alert]');

$dropMenu.on('click', function() {
    $dropMenu.toggleClass('turn-open');
    $navLinks.toggleClass('show');
});

function formSubmit() {
    var $trackingNumberForm = $(`[data-form="form"]`);
    $trackingNumberForm.on('submit', function(event) {
        event.preventDefault();
        var serializedArray = $trackingNumberForm.serializeArray();
        var trackingNumber = serializedArray[0].value;
        var shippingCompany = $('#sel1').val();
        apiCalls(trackingNumber,shippingCompany);
    });
};

function getUPSdata (tracking) {
    var data = $.ajax({
        'url': 'http://localhost:3000/https://wwwcie.ups.com/rest/Track',
        'type': 'POST',
        'data': JSON.stringify({
            'UPSSecurity': {
                'UsernameToken': {
                'Username': 'trackmapdc',
                'Password': 'Maptrackdc123!'
                },
                    'ServiceAccessToken': {
                        'AccessLicenseNumber':'DD394D0B24CA9D88'
                    }
                },
                'TrackRequest': {
                    'Request': {
                        'RequestOption':'1'
                    },
                    'InquiryNumber': tracking
                }
        })
    });
    return data;
};



function transformUpsData (data) {
    
    if (data['TrackResponse']) {

        $inputField.removeClass('red-border');
        $mapContainer.removeClass('move-map');
        $theMap.addClass('map-border');
        $alert.addClass('hide');

        var transformData = data['TrackResponse']['Shipment']['Package']['Activity'];
        var dataArray = [];
        var key = "&key=AIzaSyCBha1IL7d4-v_Y9X8NA_R8Mk0qPHtTo64";
        var pkgWeight = {
            unit: data['TrackResponse']['Shipment']['Package']['PackageWeight']['UnitOfMeasurement']['Code'],
            weight: data['TrackResponse']['Shipment']['Package']['PackageWeight']['Weight']
        };
        var service = data['TrackResponse']['Shipment']['Service']['Description'];
        for (var x = 0; x < transformData.length; x++) {
            var city = transformData[x]['ActivityLocation']['Address']['City'];
            var state = transformData[x]['ActivityLocation']['Address']['StateProvinceCode'];
            var status = transformData[x]['Status']['Description'];
            var date = transformData[x]['Date'];
            var date2 = `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`;
            var time = transformData[x]['Time'];
            var time2 = `${time.slice(0, 2)}:${time.slice(2, 4)}`;
            // the first location that is used seems to be the country only
            if (city === undefined) {
                break;
            };
            url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city},+${state}${key}`;
            dataArray[x] = {
                'city': city,
                'state': state,
                'status': status,
                'date': date2,
                'time': time2,
                'URL': url
            };
        };
        trackingCodeAlertUPS(transformData);
        eraseTable();
        createTable(dataArray);
        return dataArray;

    } else {
        trackingCodeError();
    };
    
};

function eraseTable() {
    $checkpointTableBody.empty();
}

function createTable(dataArray) {
    $checkpointTable.removeClass('hide');
    var dataLength = dataArray.length;
    for (var i = 0; i < dataLength; i++) {
        var reverse = dataLength - (i + 1);
        var tData = $(`<tr><td>${i + 1}</td>
                           <td>${dataArray[reverse].city}</td>
                           <td>${dataArray[reverse].state}</td>
                           <td>${dataArray[reverse].status}</td>
                           <td>${dataArray[reverse].date}</td>
                           <td>${dataArray[reverse].time}</td></tr>`);
        $checkpointTableBody.append(tData);
    }
}

function geoLoop(dataArray) {

    var promArray = dataArray.map(function(obj) {
        return $.get(obj['URL']);
    });
    Promise.all(promArray)
    .then(function(geoArray) {
        for (var i = 0; i < geoArray.length; i++) {
            dataArray[i]['LatLng'] = geoArray[i].results[0].geometry.location;
        }
        return dataArray
    })
    .then(removeDuplicates)
    .then(createMap);
}

function removeDuplicates( arr ) {
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i]['city'] == arr[i + 1]['city']) {
            arr.splice(i, 1);
        } else if (arr[i]['city'] != arr[i + 1]['city']) {
            continue;
        } else {
            break;
        }
    }
    // for ( var i = 0, len = arr.length; i < len; i++ ){
    //   if(!obj[arr[i][prop]]) obj[arr[i][prop]] = arr[i];
    // }
    // var newArr = [];
    // for ( var key in obj ) newArr.push(obj[key]);
    // console.log(newArr)
    return arr.reverse()
};

// storing data offline

function storeData (data) {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    return data;
};


function loadStoredData () {
    return JSON.parse(localStorage.getItem(LS_KEY));
};

// Procedure

function apiCalls(tracking, shippingCompany) {
    if (shippingCompany === "UPS") {
        getUPSdata(tracking)
        .then(storeData)
        // .catch(loadStoredData)
        .then(transformUpsData)
        .then(geoLoop)
    } else if (shippingCompany === 'Fedex') {
        getFedexData(tracking)
        .then(transformFedexData)
        .then(geoLoop)
    }
}

// Map and point initialization - referenced in geoLoop function Promise

function createMap(data) {
    var map;
    var infowindow = new google.maps.InfoWindow();

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 6,
        });
        drop();
    }

    function drop() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < data.length; i++) {

            addMarkerWithTimeout(data[i], i * 500);
            bounds.extend(data[i]['LatLng']);

            if (i > 0) {
                timeoutDrawLines(i);
            }
        }
            
        function timeoutDrawLines(i) {
            setTimeout(drawLine, i * 600, i);
        }

        function drawLine(i) {
            var cityCoordinates = [data[i - 1]['LatLng'], data[i]['LatLng']];
            var linePath = new google.maps.Polyline({
                path: cityCoordinates,
                geodesic: true,
                strokeColor: '#1E8BC3',
                strokeOpacity: 0.5,
                strokeWeight: 3
            });
            linePath.setMap(map);
        }
        map.fitBounds(bounds);
    }



    function addMarkerWithTimeout(markerPosition, timeout) {
        setTimeout(function() {
            var newMarker = new google.maps.Marker({
                position: markerPosition['LatLng'],
                map: map,
                animation: google.maps.Animation.DROP,
            });
            var markerObject = {
                'Marker': newMarker,
                'Info': `<strong>City</strong>: ${markerPosition['city']}</p>
                <p><strong>State</strong>: ${markerPosition['state']}</p>
                <p><strong>Status</strong>: ${markerPosition['status']}`
            }
            markerObject['Marker'].addListener('click', function() {
                infowindow.setContent(markerObject['Info']);
                infowindow.open(map, markerObject['Marker']);
            })
        }, timeout);
    }
    initMap();
};

formSubmit();

// FEDEX Tracking

function getFedexData (tracking) {
    var url = `http://localhost:3000/http://shipit-api.herokuapp.com/api/carriers/fedex/${tracking}`
    var data = $.get(url);
    return data;
};

function transformFedexData (data) {
    if (data['activities']) {
        $inputField.removeClass('red-border');
        $mapContainer.removeClass('move-map');
        $theMap.addClass('map-border');
        $alert.addClass('hide');

        var transformData = data['activities'];
        var dataArray = [];
        var key = "&key=AIzaSyCBha1IL7d4-v_Y9X8NA_R8Mk0qPHtTo64";
        var pkgWeight = {
            unit: "",
            weight: data['weight']
        };
        var service = data['service'];
        for (x = 0; x < transformData.length; x++) {
            var cityStateArray = transformData[x]['location'].split(" ");
            var cityPop = transformData[x]['location'].split(',')
            var datetimeSplit = transformData[x]['datetime'].split('T');
            var city = cityPop[0];
            var state = cityStateArray[1];
            var status = transformData[x]['details'];
            var date = datetimeSplit[0];
            var time = datetimeSplit[1];
            var time2 = time.slice(0, 5)
            // the first location that is used seems to be the country only
            if (city === undefined) {
                break;
            };
            url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city},+${state}${key}`;
            dataArray[x] = {
                'city': city,
                'state': state,
                'status': status,
                'date': date,
                'time': time2,
                'URL': url
            };
        };
        trackingCodeAlert(data);
        eraseTable();
        createTable(dataArray);
        return dataArray; 

    } else {
        trackingCodeError();
    };

}

// Tracking number is incorrect

function removeShake () {
    $inputField.removeClass('invalid-input');
}
 
function trackingCodeError () {
    $mapContainer.addClass('move-map');
    $inputField.addClass('red-border invalid-input');
    setTimeout(removeShake, 800);
    $alert.removeClass('hide');
    $alert.addClass('alert-danger');
    $alert.text('Invalid Tracking Number');
    console.log('ERROR!');
}

function trackingCodeAlertUPS (data) {
    $alert.removeClass('alert-danger');
    $alert.removeClass('alert-success');
    $alert.removeClass('alert-warning');
    $alert.text('');
    $alert.removeClass('hide');
    $mapContainer.addClass('move-map');
    var currentStatus = data[0]['Status']['Description'];
    console.log(currentStatus);
    if (currentStatus == 'Delivered') {
        $alert.addClass('alert-success');
        $alert.text(`Status: ${data[0]['Status']['Description']}`);
    } else {
        $alert.addClass('alert-warning');
        $alert.text(`Status: ${data[0]['Status']['Description']}`);
    }
    
    
    // $alert.text(`Status: ${data[0]['Status']['Description']}`)
}

// on down scroll hide the nav bar, on scroll up show the nav bar

function scrollEvent () {
    // keeps track of last scroll
    var lastScroll = 0;
    $(window).scroll(function(event) {
        // Sets the current scroll position
        var st = $(this).scrollTop();
        // Determines up-or-down scrolling
        if ((st - lastScroll) > 0) {
            // function call for downward-scrolling
            $('form').removeClass('add-to-form');
            $('header').removeClass('add-to-header');
        } else {
            // function call for upward-scrolling
            $('form').addClass('add-to-form')
            $('header').addClass('add-to-header');
        };
        // updates scroll position
        lastScroll = st;
    });
};

// scrollEvent();