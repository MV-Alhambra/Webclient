"use strict";

document.addEventListener('DOMContentLoaded', init);

function init() {
    timer();
}

function timer() {
    let counter = 5;
    document.querySelector("#timer").innerHTML = `${counter.toString()}`;

    const interval = setInterval(function() {
        counter--;
        document.querySelector("#timer").innerHTML = `${counter.toString()}`;
        if (counter === 0) {
            // Display a login box
            clearInterval(interval);
        }
    }, 1000);
}

