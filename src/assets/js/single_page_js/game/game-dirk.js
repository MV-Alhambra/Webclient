"use strict";

function setDirk() { //makes the dirk section visible if dirk is on
    getGamePlayers(gameId, token).then(players => {
        if (players.filter(player=> player.name !== "dirk\u2122").length === 2) {
            document.querySelector("#unavailable").classList.add("hidden");
            document.querySelector("#dirk").classList.remove("hidden");
        }
    });
}

function giveBuildingToDirk(e) { // gives the building to dirk
    giveDirk(gameId, token, playerName, selectedBuilding).then(response => responseHandler(response, e, false));
}

