'use script';

document.addEventListener('DOMContentLoaded', init);

let gameId;
let playerToken;

function init() {
    document.querySelector('form').addEventListener('submit', createGame)
}

function createGame(e) {
    e.preventDefault();

    const name = document.querySelector('#Player_Name').value;

    if (!gameId) {
        addGame().then(id => {
            gameId = id;
            addLocalPlayer(e, name)
        });
    } else {
        addLocalPlayer(e, name)
    }


}

function addLocalPlayer(e, name) {
    addPlayer(gameId, name.toLowerCase()).then(response => {
        if (response.ok) {
            playerToken = response.json;
            window.location.replace('./temp.html');
        } else {
            document.querySelector('.error').innerHTML = 'That player name is not allowed!';
        }
    });

}
