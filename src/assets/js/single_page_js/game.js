"use strict";

document.addEventListener('DOMContentLoaded', init);

const gameId = localStorage.getItem('gameId');
const token = localStorage.getItem('playerToken');
const playerName = localStorage.getItem('playerName');
const scoreboard = document.querySelector('#scoreboard dl');
const title = document.querySelector('header h2');

function init() {
    setScoreboard();
    setTitle();
    document.querySelector('#pspopup').addEventListener('click', showpointsystem);
    document.querySelector('.close').addEventListener('click', closepointsystem);

}

function setScoreboard() {
    getGamePlayers(gameId, token).then(players => {
        let listScoreboard = '';
        players.forEach(player => {
            listScoreboard += `<dt>${player.name}</dt><dd>${player.score}</dd>`;
        });
        scoreboard.innerHTML = listScoreboard;
    });

}

function setTitle() {
    getGameCurrentPlayer(gameId, token).then(currentPlayer => {
        console.log(currentPlayer);
        if (playerName === currentPlayer) {
            title.innerHTML = `It's your turn!`;
        } else {
            title.innerHTML = `It's the turn of ${currentPlayer}.`;
        }
    });
}

function showpointsystem() {
    document.querySelector('.pointsystem').style.display = 'flex';
}

function closepointsystem() {
    document.querySelector('.pointsystem').style.display = 'none';
}

