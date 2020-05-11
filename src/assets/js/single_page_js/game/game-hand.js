"use strict";

const hand = document.querySelector("#hand");
let selectedBuilding = null;

function showHand() { //makes the hand visible if there are buildings in it
    getGamePlayerProperty(gameId, token, playerName, "buildings-in-hand").then(buildings => {
        if (buildings.length > 0) {
            hand.innerHTML = createBuilding(buildings[0]);
            hand.classList.remove("hidden");
            document.addEventListener("mousemove", moveHand);
            showPossibleLocations(buildings[0], addEventListenersPlaceBuilding);
            selectedBuilding = buildings[0];
            document.querySelector("#reserve").addEventListener("click", placeBuildingInReserve, {once: true});
        } else {
            hand.classList.add("hidden");
        }
    });
}

function addEventListenersPlaceBuilding(tile, building) {
    tile.addEventListener("click", e => placeBuildingOnMap(e, building, placeBuilding));
}

function moveHand(e) { //makes the hand follow the cursor
    hand.style.top = (e.clientY) + "px";
    hand.style.left = (e.clientX) + "px";
}
