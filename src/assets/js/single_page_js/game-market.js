"use strict";

let selectedMarket = null;

function setMarket() { // loads the market in
    getGameProperty(gameId, token, 'market').then(markets => {
        Object.keys(markets).forEach((market, index) => { //object.keys turns an objects its keys into an array with index holding the original order
            marketBuildings[index].innerHTML = createBuilding(markets[market]);
            if (turnPlayer === playerName) {
                document.querySelectorAll("#market .building").forEach(building => building.addEventListener("click", selectMarket));
            }
        });
    });
}

function selectMarket(e) { //logic for selecting the market
    deselectBankCoins();
    deselectReserve();
    if (e.target.classList.contains("selectMarketBuilding")) {
        deselectMarket();
    } else {
        deselectMarket();
        e.target.classList.add("selectMarketBuilding");
        selectedMarket = convertToMarket(e.target);
    }
}

function convertToMarket(building) { //converts a building to a market only works on buildings from the market
    return {
        currency: building.parentElement.getAttribute("data-currency"),
        building: convertBuildingToObject(building)
    };
}

function deselectMarket() { // deselect the market
    selectedMarket = null;
    document.querySelectorAll('.selectMarketBuilding').forEach(building => building.classList.remove("selectMarketBuilding"));
}

function grabBuilding(e) { // buys the building, building is now in the hand
    if (turnPlayer === playerName) {
        if (coins.length === 0) { //give error with no coins selected
            showError("No coins are selected!", e);
        } else if (selectedMarket === null) { //give error that no market is selected
            showError("No market is selected!", e);
        } else if (selectedMarket.currency !== coins[0].currency) { //give error for wrong currency
            showError("Wrong currency is given!", e);
        } else if (selectedMarket.building.cost > totalCoins()) { //give error not enough coins are selected
            showError("Not enough coins are selected!", e);
        } else {
            buyBuilding(gameId, token, playerName, selectedMarket.currency, coins).then(response => responseHandler(response, e, false, true));
        }
    }
}

