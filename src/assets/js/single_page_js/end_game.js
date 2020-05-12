"use strict";

const gameId = localStorage.getItem('gameId');
const playerName = localStorage.getItem('playerName');

const scoreBoard = document.querySelector('#players');

const scoreBoardTest = [
    { name: 'jan', score: 200 },
    { name: 'maxim', score: 400 },
    { name: 'Joe', score: 300 },
]; // just for testing so i dont have to make a game over and over again

document.addEventListener('DOMContentLoaded', init);


function init() {
    loadInScore(getPlayersAndScore());
}

function loadInScore(playersScore) {
    scoreBoard.innerHTML = "";
    playersScore.forEach( (player, index) =>
        scoreBoard.innerHTML += `<section>
        <h2>${index + 1}</h2>
        <h3>${player.name}</h3>
        <h4>${player.score}</h4>
        <h5>Title:</h5>
        <h6>Description</h6>
        <a href="#">Show village</a>
    </section>`
    )
}

function getPlayersAndScore() { // loads the scoreboard in
    getGamePlayers(gameId).then(players => { //todo add token later
        let scoreboard = [];
        players.forEach(player => {
            scoreboard.push({name : player.name , score : player.score})
        });
        return orderByScore(scoreboard);
    });
}

function orderByScore(scoreboard) {
    scoreboard.sort(function (a, b) {
        return  b.score - a.score;
    });
    return scoreboard;
}

