var $sethTarget = $('[data-pic-seth]');
var $alexTarget = $('[data-pic-alex]');
var $evanTarget = $('[data-pic-evan]');
var $andrewTarget = $('[data-pic-andrew]');

    
function sethPicOnCLick() {
    $sethTarget.on('click', function(event) {
            $sethTarget.toggleClass('translate1');
            $alexTarget.toggleClass('animated fadeOutDown');
            $evanTarget.toggleClass('animated fadeOutDown');
            $andrewTarget.toggleClass('animated fadeOutDown');
    })
}

function alexPicOnCLick() {
    $alexTarget.on('click', function(event) {
            $alexTarget.toggleClass('translate2');
            $sethTarget.toggleClass('animated fadeOutDown');
            $evanTarget.toggleClass('animated fadeOutDown');
            $andrewTarget.toggleClass('animated fadeOutDown');
    })
}

function evanPicOnCLick() {
    $evanTarget.on('click', function(event) {
            $evanTarget.toggleClass('translate3');
            $sethTarget.toggleClass('animated fadeOutDown');
            $alexTarget.toggleClass('animated fadeOutDown');
            $andrewTarget.toggleClass('animated fadeOutDown');
    })
}

function andrewPicOnCLick() {
    $andrewTarget.on('click', function(event) {
            $andrewTarget.toggleClass('translate4');
            $sethTarget.toggleClass('animated fadeOutDown');
            $alexTarget.toggleClass('animated fadeOutDown');
            $evanTarget.toggleClass('animated fadeOutDown');
    })
}

sethPicOnCLick();
alexPicOnCLick();
evanPicOnCLick();
andrewPicOnCLick();









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