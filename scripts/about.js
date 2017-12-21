var $sethTarget = $('[data-pic-seth]');
var $alexTarget = $('[data-pic-alex]');
var $evanTarget = $('[data-pic-evan]');
var $andrewTarget = $('[data-pic-andrew]');
var $textBox = $('[data-text-box]');
var $list = $('[data-list]');

    
function sethPicOnClick() {
    $sethTarget.on('click', function(event) {
        $list.text('');
        $sethTarget.toggleClass('translate1');
        $alexTarget.toggleClass('animated fadeOut');
        $evanTarget.toggleClass('animated fadeOut');
        $andrewTarget.toggleClass('animated fadeOut');
        $textBox.toggleClass('animated hidden fadeIn');
        $list.append(`<p><strong>Seth Zimmerman</strong></p><p>Collected data from UPS API</p><p>Created data objects through promise chain</p><p>Wrote on-click functionality of mapmarkers and info therein</p><p>Scripted and made UI of 'About' page</p>`)
    })
}

function alexPicOnClick() {
    $alexTarget.on('click', function(event) {
        $list.text('');
        $alexTarget.toggleClass('translate2');
        $sethTarget.toggleClass('animated fadeOut');
        $evanTarget.toggleClass('animated fadeOut');
        $andrewTarget.toggleClass('animated fadeOut');
        $textBox.toggleClass('animated hidden fadeIn');
        $list.append(`<p><strong>Alexander Cleoni</strong></p><p>Completed the transformed the json string into a usable dictionary</p><p>InitiapzedUI for 'About' page</p><p>Discovered and connected the city/state to longitude/latitude APIconverter</p>`)
    })
}

function evanPicOnClick() {
    $evanTarget.on('click', function(event) {
        $list.text('');
        $evanTarget.toggleClass('translate3');
        $sethTarget.toggleClass('animated fadeOut');
        $alexTarget.toggleClass('animated fadeOut');
        $andrewTarget.toggleClass('animated fadeOut');
        $textBox.toggleClass('animated hidden fadeIn');
        $list.append(`<p><strong>Evan Bates</strong></p><p>Converted the UPS API into a functional array for the longitude/latitude API converter to leverage</p><p>Wrote and structured ReadMe</p>`)
    })
}

function andrewPicOnClick() {
    $andrewTarget.on('click', function(event) {
        $list.text('');
        $andrewTarget.toggleClass('translate4');
        $sethTarget.toggleClass('animated fadeOut');
        $alexTarget.toggleClass('animated fadeOut');
        $evanTarget.toggleClass('animated fadeOut');
        $textBox.toggleClass('animated hidden fadeIn');
        $list.append(`<p><strong>Andrew Keller</strong></p><p>Structured the Google Map API to accept multiple longitude/latitude coordinates</p><p>Printed coordinates to the browser and created access to Google Maps API</p><p>Designed and implemented custom header</p>`)
    })
}

sethPicOnClick();
alexPicOnClick();
evanPicOnClick();
andrewPicOnClick();









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