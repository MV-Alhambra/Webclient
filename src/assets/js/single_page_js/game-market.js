"use strict";

function setMarket() { // loads the market in
    getGameProperty(gameId, token, 'market').then(markets => {
        Object.keys(markets).forEach((market, index) => { //object.keys turns an objects its keys into an array with index holding the original order
            marketBuildings[index].innerHTML = createBuilding(markets[market]);
        });
    });
}

function convertBuildingToObject(building) {
    const classList = building.classList;
    return {
        type: getType(classList),
        cost: parseInt(building.innerHTML),
        walls:{
            north: classList.contains("northWall") ,
            east: classList.contains("eastWall") ,
            south:  classList.contains("southWall"),
            west: classList.contains("eastWall")
        }
    }
}

function getType(classList) {

}