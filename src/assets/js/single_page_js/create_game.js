'use strict';

document.addEventListener('DOMContentLoaded', init);

let gameId;
let playerToken;
let gameName;
let playerName;

function init() {
    document.querySelector('form').addEventListener('submit', createGame);
}

function createGame(e) {
    e.preventDefault();

    playerName = document.querySelector('#Player_Name').value;
    gameName = document.querySelector('#Game_Name').value;

    if (!gameId) {
        addGame().then(id => {
            gameId = id;
            addLocalPlayer(e, playerName);
        });
    } else {
        addLocalPlayer(e, playerName);
    }
}

function addLocalPlayer(e, name) {
    addPlayer(gameId, name.toLowerCase()).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw Error;
        }
    }).then(jsonToken => {
        playerToken = jsonToken;
        localStorage.setItem('gameId', gameId);
        localStorage.setItem('playerToken', playerToken);
        localStorage.setItem('gameName', gameName);
        localStorage.setItem('playerName', playerName);
        window.location.replace('./game_lobby.html');
    }).catch(() => document.querySelector('.error').innerHTML = 'That player name is not allowed!');
}
