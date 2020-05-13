"use strict";

const gameId = localStorage.getItem('gameId');
const playerName = localStorage.getItem('playerName');
const token = localStorage.getItem('playerToken');

const scoreBoard = document.querySelector('#players');
const winOrLose = document.querySelector('h1');


document.addEventListener('DOMContentLoaded', init);


function init() {
    getPlayersAndScore().then(response => {
        loadInScore(response);
        checkWin(response);
    });

}

function loadInScore(playersScore) {
    scoreBoard.innerHTML = "";
    playersScore.forEach((player, index) =>
        scoreBoard.innerHTML += `<section>
        <h2>${index + 1}</h2>
        <h3>${player.name}</h3>
        <h4>${player.score}</h4>
        <h5>Title:</h5>
        <h6>Description</h6>
        <a href="#">Show village</a>
    </section>`);
}

function getPlayersAndScore() { // loads the scoreboard in
    return getGamePlayers(gameId, token).then(players => {
        const scoreboard = [];
        players.forEach(player => {
            scoreboard.push({name: player.name, score: player.score});
        });
        return orderByScore(scoreboard);
    });
}

function orderByScore(scoreboard) {
    scoreboard.sort(function (a, b) {
        return b.score - a.score;
    });
    return scoreboard;
}

function checkWin(response) {
    console.log(response);
    if (response[0].name === playerName) {
        winOrLose.innerText = "Victory!";
    } else {
        winOrLose.innerText = "Better luck next time ...";
    }
}

