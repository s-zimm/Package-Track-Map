var LS_KEY = 'ups-data';
var $checkpointTable = $('[data-checkpoint]');
var $inputField = $('[data-tracking-number]');
var $mapContainer = $('[data-map-container]');
var $theMap = $('[data-map]');
var $alert = $('[data-alert]');

// var STATUS;

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
    console.log(data);
    
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
        eraseTable();
        createTable(dataArray);
        return dataArray;

    } else {
        trackingCodeError();
    };
    
};

function eraseTable() {
    $checkpointTable.empty();
}

function createTable(dataArray) {
    var dataLength = dataArray.length;
    for (var i = 0; i < dataLength; i++) {
        var reverse = dataLength - (i + 1);
        var tData = $(`<tr><td>${i + 1}</td>
                           <td>${dataArray[reverse].city}</td>
                           <td>${dataArray[reverse].state}</td>
                           <td>${dataArray[reverse].status}</td>
                           <td>${dataArray[reverse].date}</td>
                           <td>${dataArray[reverse].time}</td></tr>`);
        $checkpointTable.append(tData);
    }
}

function geoLoop(dataArray) {
    var cityInfo = [];
    for (var x = 0; x < dataArray.length; x++) {
        url = dataArray[x]['URL'];  
        cityInfo.push($.get(url));
    }
    Promise.all(cityInfo)
        .then(transformGeocode)
        .then(createMap)
}

function removeDuplicates( arr, prop, prop ) {
        var obj = {};
        for ( var i = 0, len = arr.length; i < len; i++ ){
          if(!obj[arr[i][prop]]) obj[arr[i][prop]] = arr[i];
        }
        var newArr = [];
        for ( var key in obj ) newArr.push(obj[key]);
        console.log(newArr)
        return newArr
    };
      
    function returnfilterArray(data){
        var filteredArray = data;
        return filteredArray;
     };
     
     function transformGeocode(data) {
         var resultsArray = [];
         var info = data;
        console.log(data);
         info.forEach(function(position) {
             resultsArray.push(position.results[0].geometry.location);  
        })
        console.log(resultsArray);
        var noDuplicates = removeDuplicates(resultsArray,"lat","lng");
        return returnfilterArray(noDuplicates);
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
    var markers = [];
    var map;

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 6,
        });
        drop();
    }

    function drop() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < data.length; i++) {

            if (i + 1 == (data.length)) {
                addEndMarkerWithTimeout(data[i], i * 500);
                bounds.extend(data[i]);
            } else {
                addMarkerWithTimeout(data[i], i * 500);
                bounds.extend(data[i]);
            }
            if (i > 0) {
                timeoutDrawLines(i);
            }
        }
            
        function timeoutDrawLines(i) {
            setTimeout(drawLine, i * 600, i);
        }

        function drawLine(i) {
            var cityCoordinates = [data[i - 1], data[i]];
            var linePath = new google.maps.Polyline({
                path: cityCoordinates,
                geodesic: true,
                strokeColor: '#77237a',
                strokeOpacity: 0.8,
                strokeWeight: 5
            });
            linePath.setMap(map);
        }
        map.fitBounds(bounds);
    }



    function addMarkerWithTimeout(markerPosition, timeout) {
        setTimeout(function() {
            markers.push(new google.maps.Marker({
                position: markerPosition,
                map: map,
                animation: google.maps.Animation.DROP,
            }));
        }, timeout);
    }

    function addEndMarkerWithTimeout(markerPosition, timeout) {
        setTimeout(function() {
            markers.push(new google.maps.Marker({
                position: markerPosition,
                map: map,
                animation: google.maps.Animation.DROP,
                // icon: 'icons/blue-marker.png'
            }));
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
    console.log(data);
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
    console.log('ERROR!');
}