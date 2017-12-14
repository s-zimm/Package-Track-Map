var LS_KEY = 'ups-data'
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
        url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city} + ${state}${key}`;
        urlArray[x] = url;
    };
    return urlArray;
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
    .then(transformUpsData);
}

formSubmit();
