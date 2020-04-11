"use strict";

const hand = document.querySelector("#hand");
let handEvent;
let reserveEvent = null;

function showHand() {
    getGamePlayerProperty(gameId, token, playerName, "buildings-in-hand").then(buildings => {
        if (buildings.length > 0) {
            hand.innerHTML = createBuilding(buildings[0]);
            hand.classList.remove("hidden");
            handEvent = document.addEventListener("mousemove", moveHand);
            showPossibleLocations(buildings[0]);
            reserveEvent = document.querySelector("#reserve").addEventListener("click", e => placeBuildingInReserve(e, buildings[0]));
        } else {
            hideHand();
        }
    });
}

function moveHand(e) {
    hand.style.top = (e.clientY) + "px";
    hand.style.left = (e.clientX) + "px";
}

function hideHand() {
    document.removeEventListener("mousemove", handEvent);
    hand.classList.add("hidden");
    if (reserveEvent !== null) {
        document.querySelector("#reserve").removeEventListener("click", reserveEvent);
        reserveEvent = null;
    }
}
