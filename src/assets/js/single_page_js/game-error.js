"use strict";

let errorEvent = null;
let timeoutError;
const mouseError = document.querySelector("#mouseError");

function showError(text, e) { // displays the error, automatically removes it after 5s
    if (errorEvent !== null) {
        clearTimeout(timeoutError);
        removeError();
        showError(text, e);
    } else {
        moveError(e); //set initial location
        errorEvent = document.addEventListener("mousemove", moveError);
        mouseError.innerHTML = text;
        mouseError.classList.remove("hidden");
        timeoutError = setTimeout(removeError, 5000);
    }
}

function moveError(e) { //makes the error follow the cursor
    mouseError.style.top = (e.clientY + 10) + "px";
    mouseError.style.left = (e.clientX + 10) + "px";
}

function removeError() { // remove the error
    document.removeEventListener("mousemove", errorEvent);
    errorEvent = null;
    mouseError.classList.add("hidden");
}
