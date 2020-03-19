'use strict';

document.addEventListener('DOMContentLoaded', init);
let gameId;

function init() {
    checkLS();
    document.querySelector('form').addEventListener('submit', joinGame)
}

function checkLS() {
    if (!localStorage.getItem('gameId')) {
        window.location.replace('./list_games.html');
    } else {
        gameId = localStorage.getItem('gameId');
    }
}

function joinGame(e) {
    e.preventDefault();

    const NAME = document.querySelector('#userid').value;

    addPlayer(gameId, NAME.toLowerCase()).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw Error;
        }
    }).then(jsonToken => {
        localStorage.setItem('playerToken', jsonToken);
        localStorage.setItem('playerName', NAME);
        window.location.replace('./game_lobby.html');
    }).catch(err => document.querySelector('.error').innerHTML = 'That player name is already used!')
}
