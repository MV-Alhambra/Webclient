"use strict";

document.addEventListener('DOMContentLoaded', init);

const gameId = localStorage.getItem('gameId');
const token = localStorage.getItem('playerToken');
const playerName = localStorage.getItem('playerName');
let timerId = null;

const scoreboard = document.querySelector('aside dl');
const header = document.querySelector('h1');
const tempReady = document.querySelector('main>h2');
const waiting = document.querySelectorAll("main h2")[1];
const readyButton = document.querySelector('main a');
const waitingAnimation = document.querySelector('span');
const shadowButton = document.querySelector('.shadow');


function init() {
    checkLS();
    setLSReadyButton();
    document.querySelector('header a').addEventListener('click', leaveGamePlayer);
    document.querySelector('#copy').addEventListener('click', copy);
    readyButton.addEventListener('click', changePlayerStatus);
    polling();
    waitingTimer();
}

function checkLS() {
    if (!localStorage.getItem('playerToken')) {
        window.location.replace('./index.html');
    }
}

function setLSReadyButton() {
    const button = document.querySelector(".button")
    button.id = localStorage.getItem("button");
    if (localStorage.getItem("button") === "unready") {
        button.innerHTML = "Unready";
        shadowButton.style.boxShadow = '0 0 10px 5px rgba(231, 9, 9, 0.8)';
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

async function getGameStarted(gameId, token) {
    const game = await getGame(gameId, token);
    return game.readyCount === game.playerCount && parseInt(game.readyCount) > 1;
}

async function polling() { //updates everything each half a second
    const started = await getGameStarted(gameId, token);
    if (started) { //checks if the game is started
        waiting.classList.add("white");
        if (timerId === null) {
            timerId = timer();
        }
    } else {
        waiting.classList.remove("white");
        if (timerId !== null) { //removes the timer
            clearInterval(timerId);
            timerId = null;
        }
        setPlayersJoined();
    }
    setScoreboard();
    setTimeout(() => polling(), 500);
}

function setPlayersJoined() { //set the amount of players joined
    getPlayerCount(gameId, token).then(count => {
        header.innerText = count + "/6 players joined";
    });
}

function setScoreboard() { // loads the scoreboard
    getGamePlayers(gameId, token).then(players => {
        let listScoreboard = '';

       players.forEach(player => {
            listScoreboard += `<dt>${player.name}</dt><dd>${player.status ? "ready" : "not ready"}</dd>`;
        });
        scoreboard.innerHTML = listScoreboard;
    });
}

function changePlayerStatus(e) { //sets the player to ready/unready
    e.preventDefault();
    if (e.target.innerText === 'Ready up') {
        setPlayerReady(gameId, token, playerName).then(response => {
            if (response) {
                localStorage.setItem("button", "unready")
                e.target.innerText = 'Unready';
                e.target.id = 'unready';
                shadowButton.style.boxShadow = '0 0 10px 5px rgba(231, 9, 9, 0.8)';
            }
        });
    } else {
        setPlayerUnready(gameId, token, playerName).then(response => {
            if (response) {
                localStorage.setItem("button", "ready")
                e.target.innerText = 'Ready up';
                e.target.id = 'ready';
                shadowButton.style.boxShadow = '0 0 10px 5px rgba(9, 231, 103, 0.8)';
            }
        });
    }
}

function timer() { // timer for starting game
    let counter = 5;
    return setInterval(function () {
        header.innerHTML = `The game is starting in ${counter.toString()}s`;
        if (counter === 0) { //stop interval
            startGame(gameId, token).then(() => {
                localStorage.setItem("sinceScoreboard", "0"); // for counters
                window.location.replace('./game.html');
            });
        }
        counter--;
    }, 1000);
}


function waitingTimer() {  //de animation for the dots
    let i = 3;
    setInterval(function () {
        if (i > 0) {
            waitingAnimation.innerHTML += ".";
            i--;
        } else {
            waitingAnimation.innerHTML = "";
            i = 3;
        }
    }, 1000);
}

