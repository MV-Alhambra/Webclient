"use strict";

document.addEventListener('DOMContentLoaded', init);

function init() {
    let counter = 5;
    let interval = setInterval(function() {
        counter--;
        document.querySelector("#timer").innerHTML = `${counter.toString()}`;
        if (counter === 0) {
            // Display a login box
            clearInterval(interval);
        }
    }, 1000);
}
