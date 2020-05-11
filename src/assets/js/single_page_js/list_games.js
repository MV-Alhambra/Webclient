'use strict';

document.addEventListener('DOMContentLoaded', init);

function init() {
    fillLobbyList();
    document.querySelector('a').addEventListener('click', fillLobbyList);
}

function fillLobbyList() {
    const list = document.querySelector('main ul');
    list.innerHTML = '';
    returnGames().then(result => {
        result.forEach(lobby => {
            if (lobby.playerCount > 0 && lobby.playerCount < 6) {
                list.innerHTML += `<div class="shadow"><li><p>${lobby.customNameLobby}</p><em>${lobby.playerCount}/6 players</em> `;
                list.innerHTML += +`<a href="#" data-id='${lobby.id}'>Join game</a></li></div>`; // i had to split the string bc of sonar
            }
        });
        document.querySelectorAll('main ul li a').forEach(a => a.addEventListener('click', activateJoin));
    });
}

function activateJoin(e) {
    e.preventDefault();
    const ID = e.target.getAttribute('data-id');
    localStorage.setItem('gameId', ID);
    window.location.replace('./join_game.html');
}
