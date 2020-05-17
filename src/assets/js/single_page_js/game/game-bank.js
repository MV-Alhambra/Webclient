"use strict";

let bankCoins = [];

const bankCoinDrag = document.querySelector("#bankCoinDrag");

function setBank() { // loads the bank in

    getGameProperty(gameId, token, 'bank').then(bank => {
        let coins = '';
        bank.filter(coin => coin !== null).forEach(coin => coins += `<p class="${coin.currency}">${coin.amount}</p>`);
        bankWrapper.innerHTML = coins;
        if (turnPlayer === playerName) {
            document.querySelectorAll("#containerBank p").forEach(coin => coin.addEventListener("click", selectBankCoins));
            setListenersDragBankCoin();
        }
    });
}

function setListenersDragBankCoin() {
    const selectBankCoin = document.querySelectorAll("#bank p");
    selectBankCoin.forEach(coin => coin.addEventListener("drag", dragBankCoin));
    selectBankCoin.forEach(coin => coin.addEventListener("dragstart", dragStartBankCoin));
    selectBankCoin.forEach(coin => coin.addEventListener("dragend", dragEndBankCoin));
    document.querySelector("#money").addEventListener("drop", dropBankCoin); // this triggers when an item gets dropped in it
    document.querySelector("#money").addEventListener("dragover", allowDropBankCoin);//this sets the location where i can drop the items
}

function convertBankCoinToObject(e) { //turns the html of a coin into an object we can use
    return {
        currency: getColor(e.target.classList),
        amount: parseInt(e.target.innerHTML)
    };
}

function selectBankCoins(e) { //selector logic for the coins
    deselectCoins();
    deselectMarket();
    deselectReserve();
    const classList = e.target.classList;
    if (classList.contains("selectBankCoin")) { //unselect selected coin
        e.target.setAttribute("draggable", "false");
        classList.remove("selectBankCoin");
        bankCoins.splice(bankCoins.findIndex(coin => coin === convertBankCoinToObject(e)), 1);
    } else if (totalBankCoins() + parseInt(e.target.innerHTML) < 6 || bankCoins.length === 0) { //add more coins if total coins under 6
        e.target.setAttribute("draggable", "true");
        classList.add("selectBankCoin");
        bankCoins.push(convertBankCoinToObject(e));
    } else { //select new coin
        deselectBankCoins();
        classList.add("selectBankCoin");
        e.target.setAttribute("draggable", "true");
        bankCoins.push(convertBankCoinToObject(e));
    }
}

function getColor(classList) { // returns the color of the class list of that coin
    return colors.find(color => classList.contains(color));
}

function totalBankCoins() { //gives total amount of value of coins back
    let sum = 0;
    bankCoins.forEach(coin => sum += coin.amount);
    return sum;
}

function deselectBankCoins() { //deselect all coins
    bankCoins = [];
    document.querySelectorAll("#bank .selectBankCoin").forEach(coin => coin.setAttribute("draggable", "false"));
    document.querySelectorAll('#containerBank p').forEach(coin => coin.classList.remove("selectBankCoin"));
}

function grabCoins(e) { //send selected coins to the server
    if (playerName === turnPlayer) {
        if (bankCoins.length === 0) {
            showError("No coins selected!", e);
        } else {
            takeCoins(gameId, token, playerName, bankCoins).then(response => {
                responseHandler(response, e);
                if (response.ok) { //empty the bankCoins when transaction is completed
                    bankCoins = [];
                }
            });
        }
    }
}

function dragBankCoin(e) {//makes the coin stay near the cursor
    bankCoinDrag.style.top = (e.clientY) + "px";
    bankCoinDrag.style.left = (e.clientX) + "px";
}

function dragStartBankCoin(e) {
    bankCoinDrag.style.top = (e.clientY) + "px";
    bankCoinDrag.style.left = (e.clientX) + "px";
    document.querySelectorAll("#bank .selectBankCoin").forEach(coin => coin.classList.add("dragged"));
    e.dataTransfer.setData("bankcoin", null);
    bankCoinDrag.classList.remove("hidden");
}

function dragEndBankCoin() {
    bankCoinDrag.classList.add("hidden");
    setBank();//remove opacity of coins
}

function dropBankCoin(e) {
    grabCoins(e);
}

function allowDropBankCoin(e) {
    if (e.dataTransfer.types.includes("bankcoin")) { //only allows custom drag to drop
        e.preventDefault();
    }
}



