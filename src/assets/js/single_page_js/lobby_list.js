'use strict';

document.addEventListener('DOMContentLoaded',init);

function init(){
    fillLobbyList();
    document.querySelector('main>a').addEventListener('click',fillLobbyList);
}

function fillLobbyList() {
    const list = document.querySelector('main ul');
    list.innerHTML='';
    returnGames().then(function (result) {
        result.forEach( lobby => {
            list.innerHTML +=  `<li><p>${lobby.id}</p> <em>${lobby.playerCount}/6 players</em> <a href="join-game.html">Join game</a></li>`;
        });
    });
}
