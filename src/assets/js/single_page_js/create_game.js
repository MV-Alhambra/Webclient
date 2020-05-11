'use strict';

document.addEventListener('DOMContentLoaded', init);

const error =document.querySelector('.error');
let gameId;
let playerToken;
let gameName;
let playerName;


function init() {
    document.querySelector('form').addEventListener('submit', createGame);
}

function createGame(e) {
    e.preventDefault();

    playerName = document.querySelector('#Player_Name').value.toLowerCase();
    gameName = document.querySelector('#Game_Name').value;

    if (!validate(playerName)){ return;} // prevents code from further executing if it doesnt validate

    //the reason i do it like this else it would make a new lobby each time the name is incorrect
    if (gameId === undefined) { // checks if game has already been made then makes the game and adds player or only adds player to already created game
        addGame(gameName).then(id => {
            console.log(id);
            gameId = id;
            addLocalPlayer(e, playerName);
        });
    } else { //just add the player
        addLocalPlayer(e, playerName);
    }
}

function addLocalPlayer(e, name) {
    addPlayer(gameId, name).then(response => {
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
        localStorage.setItem("button", "ready");
        window.location.replace('./game_lobby.html');
    }).catch(() => error.innerHTML = 'Something went wrong...');
}

function validate(name) {
    if (!/^[0-9a-z]+$/.test(name)) { //using regex to check if the name is allowed
       error.innerHTML = "The name can only contain numbers and letters from the alphabet, no spaces are allowed!";
       return false;
    }
    return true;
}
