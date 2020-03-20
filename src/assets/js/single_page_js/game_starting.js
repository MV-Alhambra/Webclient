"use strict";

document.addEventListener('DOMContentLoaded', init);

function init() {

}

let timeLeft = 5;
let timer = setInterval(function(){
    if(timeLefteft <= 0){
        clearInterval(downloadTimer);
    }
    document.getElementById("progress").value = 10 - timeLeft;
    timeLeft -= 1;
}, 1000);