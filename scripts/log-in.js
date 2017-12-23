var signUpLink= document.querySelector('[data-sign-up-link]');
var target = document.querySelector('[data-hidden]');
var signUp = document.querySelector('[data-hidden-sign-up]');
var signIn =  document.querySelector('[data-sign-in]');
var signInLink = document.querySelector('[data-sign-in-link]');

signUpLink.addEventListener('click', function () {
    target.classList.remove('hidden'); 
    signUpLink.classList.add('hidden');
    signUp.classList.remove('hidden');
    signIn.classList.add('hidden');
    signInLink.classList.remove('hidden');
  });

  signInLink.addEventListener('click', function () {
    target.classList.add('hidden'); 
    signUpLink.classList.remove('hidden');
    signUp.classList.add('hidden');
    signIn.classList.remove('hidden');
    signInLink.classList.add('hidden');
  });