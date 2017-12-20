var translateBtn = document.querySelector('[data-toggle-translate]');
var target = document.querySelector('[data-target]');

var translateBtnTwo = document.querySelector('[data-toggle-translate-two]');
var targetTwo = document.querySelector('[data-target-two]');

var translateBtnThree = document.querySelector('[data-toggle-translate-three]');
var targetThree = document.querySelector('[data-target-three]');

var translateBtnFour = document.querySelector('[data-toggle-translate-four]');
var targetFour = document.querySelector('[data-target-four]');

translateBtn.addEventListener('click', function () {
    target.classList.toggle('translate'); 
    targetTwo.classList.remove('translate');
    targetThree.classList.remove('translate');
    targetFour.classList.remove('translate');
});


translateBtnTwo.addEventListener('click', function () {
    targetTwo.classList.toggle('translate');
    target.classList.remove('translate');
    targetThree.classList.remove('translate');
    targetFour.classList.remove('translate');
});


translateBtnThree.addEventListener('click', function () {
    targetThree.classList.toggle('translate');
    target.classList.remove('translate');
    targetTwo.classList.remove('translate');
    targetFour.classList.remove('translate');    
});

   
translateBtnFour.addEventListener('click', function () {
    targetFour.classList.toggle('translate');
    target.classList.remove('translate');
    targetTwo.classList.remove('translate');
    targetThree.classList.remove('translate');  
});