'use strict';

document.addEventListener('DOMContentLoaded', init);

function init() {
    document.querySelector('.leavePopup').addEventListener('click', confirmLeaving);
    document.querySelector('#returnToGame').addEventListener('click', closePopup);
}

function confirmLeaving(e) {
    e.preventDefault();
    const popup = document.querySelector('.hidden');
    popup.style.display = "inline";
}

function closePopup(e) {
    e.preventDefault();
    const popup = document.querySelector('.hidden');
    popup.style.display = "none";
}
