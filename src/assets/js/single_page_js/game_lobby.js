"use strict";

document.addEventListener('DOMContentLoaded', init);

function init() {
    document.querySelector('#copy').addEventListener('click', copy);
    setPlayersJoined();
}

function copy() {
    let copyText = document.querySelector("#inviteURL");
    selectText(copyText);
    document.execCommand("copy");
}

function selectText(text) {

    if (document.body.createTextRange) { // ms
        let range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { // moz, opera, webkit
        let selection = window.getSelection();
        let range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function setPlayersJoined() {
    getPlayerCount(localStorage.getItem('gameId'), localStorage.getItem('playerToken')).then(resp => {
       const HEADER = document.querySelector('h1');
       HEADER.innerText = HEADER.innerText.replace(HEADER.innerText.charAt(0),resp);
    })
}

