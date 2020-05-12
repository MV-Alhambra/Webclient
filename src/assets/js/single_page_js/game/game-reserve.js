"use strict";

function setReserve() { // loads in the reserve
    getGamePlayerProperty(gameId, token, playerName, "reserve").then(reserve => {
        let reserveBuildings = '';
        reserve.forEach(building => {
            reserveBuildings += createBuilding(building, -1, playerName === turnPlayer);
        });
        reserveWrapper.innerHTML = reserveBuildings;
        setRedesignSelectors();
    });
}

function placeBuildingInReserve(e) { //places the building that's in the hand into the reserve
    placeBuilding(gameId, token, playerName, selectedBuilding, null).then(response => responseHandler(response, e,false));
}
