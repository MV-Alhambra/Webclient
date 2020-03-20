"use strict";

document.addEventListener('DOMContentLoaded', init);

const gameId = localStorage.getItem('gameId');
const token = localStorage.getItem('playerToken');
const playerName = localStorage.getItem('playerName');

function init() {
    document.querySelector('header a').addEventListener('click', leaveGamePlayer);
    document.querySelector('#copy').addEventListener('click', copy);
    polling();
}

function copy() {
    const copyText = document.querySelector("#inviteURL");
    selectText(copyText);
    document.execCommand("copy");
}

function selectText(text) {
    if (document.body.createTextRange) { // ms
        const range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { // moz, opera, webkit
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function leaveGamePlayer(e) {
    e.preventDefault();
    leaveGame(gameId, token, playerName).then(response => response ? window.location.replace('./index.html') : null);
}

async function polling() {
    setPlayersJoined();

    if (await getGameStarted(gameId, token)) {
        alert('gamestarted');
    } else {
        setTimeout(() => polling(), 200);
    }
}

function setPlayersJoined() {
    getPlayerCount(gameId, token).then(resp => {
        const header = document.querySelector('h1');
        header.innerText = header.innerText.replace(header.innerText.charAt(0), resp);
    });
}

