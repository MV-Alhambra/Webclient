'use strict';

document.addEventListener('DOMContentLoaded', init);

let gameId;
let playerToken;
let gameName;
let playerName;

function init() {
    document.querySelector('form').addEventListener('submit', createGame)
}

function createGame(e) {
    e.preventDefault();

    playerName = document.querySelector('#Player_Name').value;
    gameName = document.querySelector('#Game_Name').value;

    if (!gameId) {
        addGame().then(id => {
            gameId = id;
            addLocalPlayer(e, name)
        })
    } else {
        addLocalPlayer(e, name)
    }
}

function addLocalPlayer(e, name) {
    addPlayer(gameId, name.toLowerCase()).then(response => {
        if (response.ok) {
            playerToken = response.json;
            localStorage.setItem('gameId', gameId);
            localStorage.setItem('playerToken', playerToken);
            localStorage.setItem('gameName', gameName);
            localStorage.setItem('playerName', playerName);
            window.location.replace('./temp.html');
        } else {
            document.querySelector('.error').innerHTML = 'That player name is not allowed!';
        }
    });

}
