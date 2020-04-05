"use strict";

document.addEventListener('DOMContentLoaded', init);

const gameId = localStorage.getItem('gameId');
const token = localStorage.getItem('playerToken');
const playerName = localStorage.getItem('playerName');

const scoreboard = document.querySelector('aside dl');
const header = document.querySelector('h1');
const tempReady = document.querySelector('main>h2');
const waiting = document.querySelectorAll("main h2")[1];
const readyButton = document.querySelector('main a');

function init() {
    checkLS();
    document.querySelector('header a').addEventListener('click', leaveGamePlayer);
    document.querySelector('#copy').addEventListener('click', copy);
    readyButton.addEventListener('click', changePlayerStatus);
    polling();
}

function checkLS() {
    if (!localStorage.getItem('playerToken')) {
        window.location.replace('./index.html');
    }
}

function copy() { // makes the copy button work
    const copyText = document.querySelector("#inviteURL");
    selectText(copyText);
    document.execCommand("copy");
}

function selectText(text) { //this selects the texts that needs to be copied
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

function leaveGamePlayer(e) { //leaves the game
    e.preventDefault();
    leaveGame(gameId, token, playerName).then(response => response ? window.location.replace('./index.html') : null);
}

async function polling() { //updates everything each second
    if (await getGameStarted(gameId, token)) { //checks if the game is started
        waiting.classList.add("white");
        readyButton.classList.add("hide");
        timer();
    } else {
        setScoreboard();
        setPlayersJoined();
        setPlayersReady();
        setTimeout(() => polling(), 1000);
    }
}

function setPlayersJoined() { //set the amount of players joined
    getPlayerCount(gameId, token).then(resp => {
        header.innerText = header.innerText.replace(header.innerText.charAt(0), resp);
    });
}

function setPlayersReady() { // set the amount of players ready
    getPlayerReady(gameId, token).then(resp => {
        tempReady.innerText = tempReady.innerText.replace(tempReady.innerText.charAt(0), resp);
    });
}

function setScoreboard() { // loads the scoreboard
    getGamePlayers(gameId, token).then(players => {
        let listScoreboard = '';
        players.forEach(player => {
            listScoreboard += `<dt>${player}</dt><dd>status</dd>`;
        });
        scoreboard.innerHTML = listScoreboard;
    });
}

function changePlayerStatus(e) { //sets the player to ready/unready
    e.preventDefault();
    if (e.target.innerText === 'ready') {
        setPlayerReady(gameId, token, playerName).then(response => {
            if (response) {
                e.target.innerText = 'unready';
            }
        });
    } else {
        setPlayerUnready(gameId, token, playerName).then(response => {
            if (response) {
                e.target.innerText = 'ready';
            }
        });
    }
}

function timer() { // timer for starting game
    let counter = 5;
    const interval = setInterval(function () {
        header.innerHTML = `The game is starting in ${counter.toString()}s`;
        if (counter === 0) { //stop interval
            clearInterval(interval);
            window.location.replace('./game.html');
        }
        counter--;
    }, 1000);
}

