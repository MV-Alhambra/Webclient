"use strict";

let selectedMarket = null;

function setMarket() { // loads the market in
    getGameProperty(gameId, token, 'market').then(markets => {
        Object.keys(markets).sort().forEach((market, index) => { //object.keys turns an objects its keys into an array with index holding the original order
            marketBuildings[index].innerHTML = createBuilding(markets[market]);
            if (turnPlayer === playerName) {
                setListenersDragMarket();
            }
        });
    });
}

function convertToMarket(building) { //converts a building to a market only works on buildings from the market
    return {
        currency: building.parentElement.getAttribute("data-currency"),
        building: convertBuildingToObject(building)
    };
}

function grabBuilding(e) { // buys the building, building is now in the hand
    if (turnPlayer === playerName) {
        if (selectedMarket.building.cost > totalCoins()) { //give error not enough coins are selected
            showError("Not enough coins are selected!", e);
        } else {
            buyBuilding(gameId, token, playerName, selectedMarket.currency, coins).then(response => {
                responseHandler(response, e, false);
                if (response.ok) { //empty the coins
                    emptyCoins();
                }
            });
        }
    }
}

function setCounters() { // sets the counters for the market
    getGame(gameId, token).then(response => {
        document.querySelector("#remaining").innerHTML = (50 - calcTotalBuildings(response.players)).toString();
        const player = response.players.find(player1 => player1.name === playerName);
        if (0 === player["virtual-score"] && player.score !== 0) { //still can fail if ppl put all their buildings in reserve and never on map
            localStorage.setItem("sinceScoreboard", calcTotalBuildings(response.players).toString());
        }
        const subTotal = parseInt(localStorage.getItem("sinceScoreboard"));
        document.querySelector("#sinceScoreboard").innerHTML = (calcTotalBuildings(response.players) - subTotal).toString();
    });
}

function calcTotalBuildings(players) { // calculates how many buildings have been bought
    let sum = 0;
    players.forEach(player => {
        sum += player.reserve.length;
        player.city.flatMap(row => row)
            .filter(tile => tile !== null && tile.type !== null)
            .forEach(() => sum++);
    });
    return sum;
}

function setListenersDragMarket() {
    const markets = document.querySelectorAll("#marketGrid div");
    markets.forEach(currency => currency.addEventListener("drop", dropCoins)); // this triggers when an item gets dropped in it
    markets[0].addEventListener("dragover", allowDropCoinsBlue);//this sets the location where i can drop the items
    markets[1].addEventListener("dragover", allowDropCoinsGreen);//this sets the location where i can drop the items
    markets[2].addEventListener("dragover", allowDropCoinsOrange);//this sets the location where i can drop the items
    markets[3].addEventListener("dragover", allowDropCoinsYellow);//this sets the location where i can drop the items
}

function dropCoins(e) {
    selectedMarket = convertToMarket(e.target);
    grabBuilding(e);
}

function allowDropCoinsBlue(e) {
    if (e.dataTransfer.types.includes("coins/blue")) { //only allows custom drag to drop
        e.preventDefault();
    }
}

function allowDropCoinsGreen(e) {
    if (e.dataTransfer.types.includes("coins/green")) { //only allows custom drag to drop
        e.preventDefault();
    }
}

function allowDropCoinsOrange(e) {
    if (e.dataTransfer.types.includes("coins/orange")) { //only allows custom drag to drop
        e.preventDefault();
    }
}

function allowDropCoinsYellow(e) {
    if (e.dataTransfer.types.includes("coins/yellow")) { //only allows custom drag to drop
        e.preventDefault();
    }
}

