"use strict";

let selectedMarketBuilding;

function setMarket() { // loads the market in
    getGameProperty(gameId, token, 'market').then(markets => {
        Object.keys(markets).forEach((market, index) => { //object.keys turns an objects its keys into an array with index holding the original order
            marketBuildings[index].innerHTML = createBuilding(markets[market]);
            getGameCurrentPlayer(gameId, token).then(currentPlayer => {
                if (currentPlayer === playerName) {
                    document.querySelectorAll("#market p").forEach(building => building.addEventListener("click", selectBuilding));
                }
            });
        });
    });
}

function selectBuilding(e) {
    unSelectBankCoins();
    if (e.target.classList.contains("selectMarketBuilding")) {
        e.target.classList.remove("selectMarketBuilding");
        selectedMarketBuilding = null;
    } else {
        unSelectMarketBuilding();
        e.target.classList.add("selectMarketBuilding");
        selectedMarketBuilding = convertBuildingToObject(e.target);
    }
}

function convertBuildingToObject(building) {
    const classList = building.classList;
    return {
        type: getType(classList),
        cost: parseInt(building.innerHTML),
        walls: {
            north: classList.contains("northWall"),
            east: classList.contains("eastWall"),
            south: classList.contains("southWall"),
            west: classList.contains("eastWall")
        }
    };
}

function getType(classList) {
    return types.find(type => classList.contains(type));
}

function unSelectMarketBuilding() {
    document.querySelectorAll('.selectMarketBuilding').forEach(building => building.classList.remove("selectMarketBuilding"));
}
