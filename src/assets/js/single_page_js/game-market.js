"use strict";

let selectedMarket = null;

function setMarket() { // loads the market in
    getGameProperty(gameId, token, 'market').then(markets => {
        Object.keys(markets).forEach((market, index) => { //object.keys turns an objects its keys into an array with index holding the original order
            marketBuildings[index].innerHTML = createBuilding(markets[market]);
            getGameCurrentPlayer(gameId, token).then(currentPlayer => {
                if (currentPlayer === playerName) {
                    document.querySelectorAll("#market .building").forEach(building => building.addEventListener("click", selectMarket));
                }
            });
        });
    });
}

function selectMarket(e) {
    unSelectBankCoins();
    if (e.target.classList.contains("selectMarketBuilding")) {
        unSelectMarketBuilding();
    } else {
        unSelectMarketBuilding();
        e.target.classList.add("selectMarketBuilding");
        selectedMarket = convertToMarket(e.target);
    }
}

function convertToMarket(building) {
    return {
        currency: building.parentElement.getAttribute("data-currency"),
        building: convertBuildingToObject(building)
    };
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
    selectedMarket = null;
    document.querySelectorAll('.selectMarketBuilding').forEach(building => building.classList.remove("selectMarketBuilding"));
}

function grabBuilding(e) {
    getGameCurrentPlayer(gameId, token).then(player => {
        if (player === playerName) {
            if (coins.length === 0) { //give error with no coins selected
                showError("No coins are selected!", e);
            } else if (selectedMarket === null) { //give error that no market is selected
                showError("No market is selected!", e);
            } else if (selectedMarket.currency !== coins[0].currency) { //give error for wrong currency
                showError("Wrong currency is given!", e);
            } else if (selectedMarket.building.cost > totalCoins()) { //give error not enough coins are selected
                showError("Not enough coins are selected!", e);
            } else {
                buyBuilding(gameId, token, playerName, selectedMarket.currency, coins).then(response => {
                    if (response.ok) {
                        setCoins();
                        setMarket();
                        setMap();
                    } else {
                        response.json().then(error => {
                            console.clear();//removes the error from the console
                            showError(error.cause, e); //shows the custom error from the server
                        });
                    }
                });
            }
        }
    });
}

