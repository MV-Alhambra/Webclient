"use strict";

let selectedBuilding = null;

function showHand() { //makes the hand visible if there are buildings in it
    getGamePlayerProperty(gameId, token, playerName, "buildings-in-hand").then(buildings => {
        if (buildings.length > 0) {
            hand.innerHTML = createBuilding(buildings[0]);
            hand.classList.remove("hidden");
            document.addEventListener("mousemove", moveHand);
            showPossibleLocations(buildings[0], addEventListenersPlaceBuilding);
            selectedBuilding = buildings[0];
            reserve.addEventListener("click", placeBuildingInReserve, {once: true});
            reserve.classList.add("visualCue");
        } else {
            reserve.removeEventListener("click", placeBuildingInReserve, {once: true});
            reserve.classList.remove("visualCue");
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
