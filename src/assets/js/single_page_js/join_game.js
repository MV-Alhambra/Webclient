'use strict';

document.addEventListener('DOMContentLoaded', init);

const error =document.querySelector('.error');
let gameId;

function init() {
    checkLS();
    document.querySelector('form').addEventListener('submit', joinGame);
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

    const name = document.querySelector('#userid').value.toLowerCase();

    if (!validate(name)){ return;} // prevents code from further executing if it doesnt validate

    addPlayer(gameId, name).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw Error;
        }
    }).then(jsonToken => {
        localStorage.setItem("button", "ready")
        localStorage.setItem('playerToken', jsonToken);
        localStorage.setItem('playerName', name);
        window.location.replace('./game_lobby.html');
    }).catch(()=> error.innerHTML = 'That player name is already used!');
}

function validate(name) {
    if (!/^[0-9a-z]+$/.test(name)) { //using regex to check if the name is allowed
        error.innerHTML = "The name can only contain numbers and letters from the alphabet, no spaces are allowed!";
        return false;
    }
    return true;
}
