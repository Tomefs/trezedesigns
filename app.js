window.addEventListener('scroll', reveal);

function reveal(){
    var reveals = document.querySelectorAll('.box');

    for(var i = 0; i < reveals.length; i++){

    var windowheight = window.innerHeight;
    var revealtop = reveals[i].getBoundingClientRect().top;
    var revealpoint = windowheight/2-100;

    if(revealtop < windowheight - revealpoint){
        reveals[i].classList.add('active');
    }
    else{
        reveals[i].classList.remove('active');
    } 
}
}