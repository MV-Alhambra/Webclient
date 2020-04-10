"use strict";

let errorEvent = null;
let timeoutError;
const mouseError = document.querySelector("#mouseError");

function showError(text, e) {
    if (errorEvent !== null) {
        clearTimeout(timeoutError);
        hideError();
        showError(text, e);
    } else {
        moveError(e); //set initial location
        errorEvent = document.addEventListener("mousemove", moveError);
        mouseError.innerHTML = text;
        mouseError.classList.remove("hidden");
        timeoutError = setTimeout(hideError, 5000);
    }
}

function moveError(e) {
    mouseError.style.top = (e.clientY + 10) + "px";
    mouseError.style.left = (e.clientX + 10) + "px";
}

function hideError() {
    document.removeEventListener("mousemove", errorEvent);
    errorEvent = null;
    mouseError.classList.add("hidden");
}
