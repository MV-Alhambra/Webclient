"use strict";

document.addEventListener('DOMContentLoaded', init);

const gameId = localStorage.getItem('gameId');
const token = localStorage.getItem('playerToken');
const playerName = localStorage.getItem('playerName');
const scoreboard = document.querySelector('aside dl');
const header = document.querySelector('h1');
const tempReady = document.querySelector('main>h2');

function init() {
    checkLS();
    document.querySelector('header a').addEventListener('click', leaveGamePlayer);
    document.querySelector('#copy').addEventListener('click', copy);
    document.querySelector('main a').addEventListener('click', changePlayerStatus);
    polling();
}

function checkLS() {
    if (!localStorage.getItem('playerToken')) {
        window.location.replace('./index.html');
    }
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
    setScoreboard();
    setPlayersReady();

    if (await getGameStarted(gameId, token)) {
        window.location.replace('./game.html');
    } else {
        setTimeout(() => polling(), 1000);
    }
}

function setPlayersJoined() {
    getPlayerCount(gameId, token).then(resp => {
        header.innerText = header.innerText.replace(header.innerText.charAt(0), resp);
    });
}

function setPlayersReady() {
    getPlayerReady(gameId, token).then(resp => {
       tempReady.innerText = tempReady.innerText.replace(tempReady.innerText.charAt(0), resp);
    });
}

function setScoreboard() {
    getGamePlayers(gameId, token).then(players => {
        let listScoreboard = '';
        players.forEach(player => {
            listScoreboard += `<dt>${player}</dt><dd>status</dd>`;
        });
        scoreboard.innerHTML = listScoreboard;
    });
}

function changePlayerStatus(e) {
    e.preventDefault();
    if (e.target.innerText === 'ready') {
        setPlayerReady(gameId, token, playerName).then(response => {
            if (response) {
                e.target.innerText = 'unready'
            }
        });
    } else {
        setPlayerUnready(gameId, token, playerName).then(response => {
            if (response) {
                e.target.innerText = 'ready'
            }
        });
    }
}

