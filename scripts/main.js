var LS_KEY = 'ups-data';
var STATUS;

function formSubmit() {
    var $trackingNumberForm = $(`[data-form="form"]`);
    $trackingNumberForm.on('submit', function(event) {
        event.preventDefault();
        var serializedArray = $trackingNumberForm.serializeArray();
        var trackingNumber = serializedArray[0].value;
        console.log(`Tracking number: ${trackingNumber}`);
        apiCalls(trackingNumber);
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
    var $inputField = $('[data-tracking-number]');
    var $mapContainer = $('[data-map-container]');
    var $theMap = $('[data-map]');
    var $alert = $('[data-alert]');

    function removeShake () {
        $inputField.removeClass('invalid-input');
    }
    
    if (data['TrackResponse']) {

        $inputField.removeClass('red-border');
        $mapContainer.removeClass('move-map');
        $theMap.addClass('map-border');
        $alert.addClass('hide');

        var transformData = data['TrackResponse']['Shipment']['Package']['Activity'];
        var urlArray = []
        var key = "&key=AIzaSyCBha1IL7d4-v_Y9X8NA_R8Mk0qPHtTo64";
        var STATUS = transformData[0]['Status']['Description'];
        for (x = 0; x < transformData.length; x++) {
            var city = transformData[x]['ActivityLocation']['Address']['City'];
            var state = transformData[x]['ActivityLocation']['Address']['StateProvinceCode'];
            // the first location that is used seems to be the country only
            if (city === undefined) {
                break;
            };
            url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city},+${state}${key}`;
            urlArray[x] = url;
        };
        return urlArray;

    } else {

        $mapContainer.addClass('move-map');
        $inputField.addClass('red-border invalid-input');
        setTimeout(removeShake, 800);
        $alert.removeClass('hide');
        console.log('ERROR!');
    }
    
};

function transformGeocode(data) {
    var resultsArray = [];
    var info = data;
    info.forEach(function(position) {
        resultsArray.push(position.results[0].geometry.location);
    })
    console.log(resultsArray);
    return resultsArray.reverse();
}

function geoLoop(urlArray) {
    var cityInfo = [];
    for (var x = 0; x < urlArray.length; x++) {
        url = urlArray[x];
        cityInfo.push($.get(url)); 
    }
    Promise.all(cityInfo)
        .then(transformGeocode)
        .then(createMap)
}


function storeData (data) {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    return data;
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

function apiCalls(tracking) {
    getUPSdata(tracking)
    .then(storeData)
    .catch(loadStoredData)
    .then(transformUpsData)
    .then(geoLoop)
    
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
}

formSubmit();