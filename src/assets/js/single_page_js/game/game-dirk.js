"use strict";

function setDirk() {
    getGamePlayers(gameId, token).then(players => {
        if (players.length === 2) {
            document.querySelector("#unavailable").classList.add("hidden");
            document.querySelector("#dirk").classList.remove("hidden");
        }
    });
}

function giveBuildingToDirk(e) {
    giveDirk(gameId, token, playerName, selectedBuilding).then(response => responseHandler(response, e, true));
}

