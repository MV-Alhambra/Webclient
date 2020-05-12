"use strict";

const gameId = localStorage.getItem('gameId');
const playerName = localStorage.getItem('playerName');

const winOrLoseTitle = document.querySelector('h1');
const playerNameContainer = document.querySelector('section h3');
const score = document.querySelector('section h4');


document.addEventListener('DOMContentLoaded', init);


function init() {

}



function getPlayersAndScore() { // loads the scoreboard in
    getGamePlayers(gameId).then(players => {
        let scoreboard = [];
        players.forEach(player => {
            scoreboard[player.name] = player.score;
        });
        return scoreboard
    });
}