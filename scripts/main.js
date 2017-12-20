// Configuration

var $dropMenu = $('[data-drop-menu]');
var $navLinks = $('[data-nav-link]');
var $checkpointTable = $('[data-checkpoint]');
var $checkpointTableBody = $('[data-checkpoint-body]');
var $inputField = $('[data-tracking-number]');
var $mapContainer = $('[data-map-container]');
var $theMap = $('[data-map]');
var $alert = $('[data-alert]');

// Toggling navigation menu in smaller screens

$dropMenu.on('click', function() {
    $dropMenu.toggleClass('turn-open');
    $navLinks.toggleClass('show');
});

// Creates and manages alerts and errors based on user input

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
    
    var currentStatus = data[0]['Status']['Description'];

    $alert.removeClass('alert-danger');
    $alert.removeClass('alert-success');
    $alert.removeClass('alert-warning');
    $alert.removeClass('hide');
    $alert.text('');
    $mapContainer.addClass('move-map');

    if (currentStatus == 'Delivered') {
        $alert.addClass('alert-success');

    } else {
        $alert.addClass('alert-warning');
    }
    $alert.text(`Status: ${currentStatus}`);
}

function trackingCodeAlertFedex (data) {
    
    var currentStatus = data[0]['details'];

    $alert.removeClass('alert-danger');
    $alert.removeClass('alert-success');
    $alert.removeClass('alert-warning');
    $alert.removeClass('hide');
    $alert.text('');
    $mapContainer.addClass('move-map');

    if (currentStatus == 'Delivered') {
        $alert.addClass('alert-success');

    } else {
        $alert.addClass('alert-warning');
    }
    $alert.text(`Status: ${currentStatus}`);
}

// Submits form and runs everything else

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

// Depending on form selection, processes UPS or Fedex tracking number

function apiCalls(tracking, shippingCompany) {

    if (shippingCompany === "UPS") {
        getUPSdata(tracking)
        .then(transformUpsData)
        .then(geoLoop)

    } else if (shippingCompany === 'Fedex') {
        getFedexData(tracking)
        .then(transformFedexData)
        .then(geoLoop)
    }
}

// Gets data from UPS API

function getUPSdata (tracking) {

    var data = $.ajax({
        
        'url': 'https://my-little-cors-proxy.herokuapp.com/https://wwwcie.ups.com/rest/Track',
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

// Transforms UPS object into the data we want to use

function transformUpsData (data) {
    
    // Checks to see response from UPS API is tracking data

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

            if (city === undefined) {
                break;
            };

            // Creates url that google geocoding API accepts as an ajax request

            url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city},+${state}${key}`;

            // Gathers information about each checkpoint for promises

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

// Same thing but for Fedex

function getFedexData (tracking) {

    var url = `https://my-little-cors-proxy.herokuapp.com/http://shipit-api.herokuapp.com/api/carriers/fedex/${tracking}`
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

        trackingCodeAlertFedex(transformData);
        eraseTable();
        createTable(dataArray);
        return dataArray; 

    } else {
        trackingCodeError();
    };

}

// Clears table

function eraseTable() {
    $checkpointTableBody.empty();
}

// Makes table using data from API

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

// Creates Coordinates from each City/State location

function geoLoop(dataArray) {

    var promArray = dataArray.map(function(obj) {
        return $.get(obj['URL']);
    });

    Promise.all(promArray)
    .then(function(geoArray) {

        for (var i = 0; i < geoArray.length; i++) {
            dataArray[i]['LatLng'] = geoArray[i].results[0].geometry.location;
        }

        return dataArray;
    })
    .then(removeDuplicates)
    .then(createMap);
}

// Prevents non-unique coordinates from appearing on map

function removeDuplicates( arr ) {

    for (var i = 0; i < arr.length - 1; i++) {

        for (var j = 1; j < arr.length; j++) {

            if (arr[i]['city'] == arr[j]['city']) {
                arr.splice(j, 1)
            }
        }
    }
    return arr.reverse()
};

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


// Creaes markers based on coordinates in data, and centers map using boundaries of coordinates

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
            setTimeout(drawLine, (i * 500) + 200, i);
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

// Creating markers with info, placing them one at a time

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
                <p><strong>State</strong>: ${markerPosition['state']}</p>`
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



// on down scroll hide the nav bar, on scroll up show the nav bar

// function scrollEvent () {
//     // keeps track of last scroll
//     var lastScroll = 0;
//     $(window).scroll(function(event) {
//         // Sets the current scroll position
//         var st = $(this).scrollTop();
//         // Determines up-or-down scrolling
//         if ((st - lastScroll) > 0) {
//             // function call for downward-scrolling
//             $('form').removeClass('add-to-form');
//             $('header').removeClass('add-to-header');
//         } else {
//             // function call for upward-scrolling
//             $('form').addClass('add-to-form')
//             $('header').addClass('add-to-header');
//         };
//         // updates scroll position
//         lastScroll = st;
//     });
// };