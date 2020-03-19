'use strict';

document.addEventListener('DOMContentLoaded', init);

function init() {
   document.querySelector('.leavePopup').addEventListener('click', confirmLeaving)
}

function confirmLeaving(e) {
    e.preventDefault();
    let popup = document.querySelector('.hidden');
    popup.style.display = "inline";
}