"use strict";

const gameId = localStorage.getItem('gameId');
const playerName = localStorage.getItem('playerName');

const winOrLoseTitle = document.querySelector('h1');
const playerNameContainer = document.querySelector('section h3');
const score = document.querySelector('section h4');



const scoreBoardTest = [
    { name: 'jan', score: 200 },
    { name: 'maxim', score: 400 },
    { name: 'Joe', score: 300 },
];



document.addEventListener('DOMContentLoaded', init);


function init() {
    

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

