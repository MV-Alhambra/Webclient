"use strict";

const hand = document.querySelector("#hand");
let handEvent;
let reserveEvent = null;

function showHand() { //makes the hand visible if there are buildings in it
    getGamePlayerProperty(gameId, token, playerName, "buildings-in-hand").then(buildings => {
        if (buildings.length > 0) {
            hand.innerHTML = createBuilding(buildings[0]);
            hand.classList.remove("hidden");
            handEvent = document.addEventListener("mousemove", moveHand);
            showPossibleLocations(buildings[0],addEventListenersPlaceBuilding);
            reserveEvent = document.querySelector("#reserve").addEventListener("click", e => placeBuildingInReserve(e, buildings[0]));
        } else {
            hideHand();
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

function hideHand() { //hides the hand
    console.log("hide hand called");
    document.removeEventListener("mousemove", handEvent);
    hand.classList.add("hidden");
    if (reserveEvent !== null) {
        console.log("removed event");
        document.querySelector("#reserve").removeEventListener("click", reserveEvent);
        reserveEvent = null;
    }
}
