// var $sethTarget = $('[data-pic-seth]');
// var $alexTarget = $('[data-pic-alex]');
// var $evanTarget = $('[data-pic-evan]');
// var $andrewTarget = $('[data-pic-andrew]');
// var $textBox = $('[data-text-box]');
// var $list = $('[data-list]');

    
// function sethPicOnClick() {
//     $sethTarget.on('click', function(event) {
//         $list.text('');
//         $sethTarget.toggleClass('translate1');
//         $alexTarget.toggleClass('animated fadeOut');
//         $evanTarget.toggleClass('animated fadeOut');
//         $andrewTarget.toggleClass('animated fadeOut');
//         $textBox.toggleClass('animated hidden fadeIn');
//         $list.append(`<p><strong>Seth Zimmerman</strong></p><p>Collected data from UPS API</p><p>Created data objects through promise chain</p><p>Wrote on-click functionality of mapmarkers and info therein</p><p>Scripted and made UI of 'About' page</p>`)
//     })
// }

// function alexPicOnClick() {
//     $alexTarget.on('click', function(event) {
//         $list.text('');
//         $alexTarget.toggleClass('translate2');
//         $sethTarget.toggleClass('animated fadeOut');
//         $evanTarget.toggleClass('animated fadeOut');
//         $andrewTarget.toggleClass('animated fadeOut');
//         $textBox.toggleClass('animated hidden fadeIn');
//         $list.append(`<p><strong>Alexander Cleoni</strong></p><p>Completed the transformed the json string into a usable dictionary</p><p>InitiapzedUI for 'About' page</p><p>Discovered and connected the city/state to longitude/latitude APIconverter</p>`)
//     })
// }

// function evanPicOnClick() {
//     $evanTarget.on('click', function(event) {
//         $list.text('');
//         $evanTarget.toggleClass('translate3');
//         $sethTarget.toggleClass('animated fadeOut');
//         $alexTarget.toggleClass('animated fadeOut');
//         $andrewTarget.toggleClass('animated fadeOut');
//         $textBox.toggleClass('animated hidden fadeIn');
//         $list.append(`<p><strong>Evan Bates</strong></p><p>Coverted Fedex promise data into a functional array for Geocoding</p><p>Converted the UPS API into a functional array for the longitude/latitude API converter to leverage</p><p>Wrote and structured ReadMe</p>`)
//     })
// }

// function andrewPicOnClick() {
//     $andrewTarget.on('click', function(event) {
//         $list.text('');
//         $andrewTarget.toggleClass('translate4');
//         $sethTarget.toggleClass('animated fadeOut');
//         $alexTarget.toggleClass('animated fadeOut');
//         $evanTarget.toggleClass('animated fadeOut');
//         $textBox.toggleClass('animated hidden fadeIn');
//         $list.append(`<p><strong>Andrew Keller</strong></p><p>Structured the Google Map API to accept multiple longitude/latitude coordinates</p><p>Printed coordinates to the browser and created access to Google Maps API</p><p>Designed and implemented custom header</p>`)
//     })
// }

var ABOUTDICTIONARY = [ 
    {
        name: 'Seth Zimmerman',
        image: "images/seth-pic.jpg",
        contribution: [
            'Collected data from UPS API',
            'Created data objects through promise chain',
            'Wrote on-click functionality of mapmarkers and info therein',
            'Scripted and made UI of About page'
        ]
    },
    {
        name: 'Alex Cleoni',
        image: "images/alex.jpg",
        contribution: [
            'Collected data from UPS API',
            'Created data objects through promise chain',
            'Wrote on-click functionality of mapmarkers and info therein',
            'Scripted and made UI of About page'
        ]
    },
    {
        name: 'Evan Bates',
        image: "images/evan-pic.jpg",
        contribution: [
            'Collected data from UPS API',
            'Created data objects through promise chain',
            'Wrote on-click functionality of mapmarkers and info therein',
            'Scripted and made UI of About page'
        ]
    },
    {
        name: 'Andrew Keller',
        image: "images/andrew-pic.jpeg",
        contribution: [
            'Collected data from UPS API',
            'Created data objects through promise chain',
            'Wrote on-click functionality of mapmarkers and info therein',
            'Scripted and made UI of About page'
        ]
    }
];

// creates the object class for contributors
var contributorArray = ABOUTDICTIONARY.map(function(each) {
    var name = each['name'];
    var image = each['image'];
    var contribution = each['contribution'];
    return new Contributor(name, image, contribution);
});


// creates the instances of the object
function Contributor(name,image,contribution) {
    this.name = name;
    this.image = image;
    this.contribution = contribution;
};

// create an image tag method
Contributor.prototype.createImage = function () {
    var anchor = $('<a>', {
        'href':'#',
    });
    var photo = anchor.append($('<img>', {
        'src':this.image,
        'class':'dev'
    }))
    return photo;
};

// create a paragraph with contribution facts
Contributor.prototype.createContribution = function () {
    var elementsArray = [];
    this.contribution.forEach(function (each) {
        var paragraph = $('<p>');
        elementsArray.push(paragraph.text(each));
    })
    return elementsArray;
};

// loads pictures from instances
function loadPictures (array) {
    array.forEach(function(person) {
        $('#profile-pics').append(person.createImage())
    });
};



function clickPicture () {
    $('a').click(function() {
        $('a').toggleClass('animated fadeOut');
        // setInterval(deletePics, 2000);
        // loadPictures(this);
        $(this).toggleClass('animated fadeOut')
        $(this).toggleClass('translate1');
        var contentBox = $('#profile-pics').append('<div>')
        var contributionArray = this.createContribution;
        for (var x = 0; x < contributionArray.length; x++) {
            var paragraph = $('<p>')
            contentBox.append(paragraph.innerText(contributionArray[x]));
        };
        revertPictureClick();
    });
};

function revertPictureClick () {
    $('.translate1').click(function() {
        $('a').toggleClass('animated fadeIn')
        clickPicture();
    });
};

function deletePics () {
    $('#profile-pics').empty();
}

loadPictures(contributorArray);
clickPicture();

// function removePics(picArray) {
//    $('dev').toggleClass('animated fadeOut');
//    setTimeout($('dev').remove(),2000);
// }

// function addPics(picArray) {
    
// }

// sethPicOnClick();
// alexPicOnClick();
// evanPicOnClick();
// andrewPicOnClick();









// var translateBtn = document.querySelector('[data-toggle-translate]');
// var target = document.querySelector('[data-target]');

// var translateBtnTwo = document.querySelector('[data-toggle-translate-two]');
// var targetTwo = document.querySelector('[data-target-two]');

// var translateBtnThree = document.querySelector('[data-toggle-translate-three]');
// var targetThree = document.querySelector('[data-target-three]');

// var translateBtnFour = document.querySelector('[data-toggle-translate-four]');
// var targetFour = document.querySelector('[data-target-four]');

// translateBtn.addEventListener('click', function () {
//     target.classList.toggle('translate'); 
//     targetTwo.classList.remove('translate');
//     targetThree.classList.remove('translate');
//     targetFour.classList.remove('translate');
// });


// translateBtnTwo.addEventListener('click', function () {
//     targetTwo.classList.toggle('translate');
//     target.classList.remove('translate');
//     targetThree.classList.remove('translate');
//     targetFour.classList.remove('translate');
// });


// translateBtnThree.addEventListener('click', function () {
//     targetThree.classList.toggle('translate');
//     target.classList.remove('translate');
//     targetTwo.classList.remove('translate');
//     targetFour.classList.remove('translate');    
// });

   
// translateBtnFour.addEventListener('click', function () {
//     targetFour.classList.toggle('translate');
//     target.classList.remove('translate');
//     targetTwo.classList.remove('translate');
//     targetThree.classList.remove('translate');  
// });