"use strict";

let coins = [];
const coinsDrag = document.querySelector("#coinsDrag");

function setCoins() { // loads the coins in
    getGamePlayer(gameId, token, playerName).then(player => {
        document.querySelectorAll('#moneyPlayer ul').forEach(list => list.innerHTML = '');
        player.coins.sort(compareCoins).forEach(coin => {
            const coinHolder = document.querySelector(`#${coin.currency}MoneyPlayer ul`);
            coinHolder.innerHTML += `<li>${coin.amount}</li>`;
        });
        if (turnPlayer === playerName) {
            document.querySelectorAll("#moneyPlayer li").forEach(coin => coin.addEventListener("click", selectCoin));
            setListenersDragCoins();
        }
    });
}

function compareCoins(coin1, coin2) { //comparison for the sorter
    return coin1.amount - coin2.amount;
}

function selectCoin(e) { // hold the logic for selecting coins
    deselectBankCoins();
    deselectReserve();
    const classList = e.target.classList;
    const coin = convertCoinToObject(e.target);
    if (classList.contains("selectCoin")) {
        e.target.setAttribute("draggable", "false");
        classList.remove("selectCoin");
        coins.splice(coins.findIndex(coinsCoin => coinsCoin.amount === coin.amount), 1); //remove one coin at that index
    } else if (coins.length === 0 || coins[0].currency === coin.currency) { // only allow the same currency to be selected or when no coin is selected select coin
        e.target.setAttribute("draggable", "true");
        classList.add("selectCoin");
        coins.push(coin);
    } else {
        e.target.setAttribute("draggable", "true");
        deselectCoins();
        classList.add("selectCoin");
        coins.push(coin);
    }
}

function deselectCoins() { //deselect all coins
    emptyCoins();
    document.querySelectorAll(".selectCoin").forEach(coin => coin.setAttribute("draggable", "false"));
    document.querySelectorAll('.selectCoin').forEach(coin => coin.classList.remove("selectCoin"));
}

function convertCoinToObject(coin) { //turns the html of a coin into an object we can use
    return {
        currency: coin.parentElement.parentElement.firstElementChild.innerHTML.toLowerCase(),
        amount: parseInt(coin.innerHTML)
    };
}

function totalCoins() { //gives total amount of value of coins back
    let sum = 0;
    coins.forEach(coin => sum += coin.amount);
    return sum;
}

function emptyCoins() { //bc of sonar
    coins = [];
}

function setListenersDragCoins() {
    const selectCoins = document.querySelectorAll("#money li");
    selectCoins.forEach(coin => coin.addEventListener("drag", dragCoins));
    selectCoins.forEach(coin => coin.addEventListener("dragstart", dragStartCoins));
    selectCoins.forEach(coin => coin.addEventListener("dragend", dragEndCoins));
}

function dragCoins(e) {
    coinsDrag.style.top = (e.clientY) + "px";
    coinsDrag.style.left = (e.clientX - 100) + "px";
}

function dragStartCoins(e) {
    coinsDrag.style.top = (e.clientY) + "px";
    coinsDrag.style.left = (e.clientX) + "px";
    document.querySelectorAll("#money .selectCoin").forEach(coin => coin.classList.add("dragged")); //hides the selected coins
    e.dataTransfer.setData("coins/" + coins[0].currency, null); //set the drop location bc i filter on allowDrop on that name
    coinsDrag.classList.remove("hidden");

    [...document.querySelectorAll("#marketGrid div p")]
        .filter(building => building.innerHTML.length !== 0 && building.parentElement.getAttribute("data-currency") === coins[0].currency)
        .forEach(market => market.classList.add("visualCue"));
}

function dragEndCoins() {
    document.querySelectorAll("#marketGrid div p.visualCue").forEach(market => market.classList.remove("visualCue")); //for each bc then i dont get an error when it doesnt exist
    emptyCoins(); //bc the coins are now deselected, have to stay in sync
    coinsDrag.classList.add("hidden");
    setCoins();//remove opacity of coins
}

