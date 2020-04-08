"use strict";

let bankCoins = [];

function convertCoinToObject(e) {
    const coin = e.target.classList;
    const filteredCurrency = coin.contains("yellow") ? "yellow": coin.contains("orange") ? "orange": coin.contains("blue") ? "blue":"green";
    return {
        currency: filteredCurrency,
        amount: parseInt(e.target.innerHTML)
    };
}

function selectBankCoins(e) {
    if (e.target.classList.contains("selectBankCoin")) {
        e.target.classList.remove("selectBankCoin");
        bankCoins.splice(bankCoins.findIndex(coin => coin === convertCoinToObject(e)),1);
    } else if (totalBankCoins() + parseInt(e.target.innerHTML) < 6 || bankCoins.length ===0) {
        e.target.classList.add("selectBankCoin");
        bankCoins.push(convertCoinToObject(e));
    } else {
        unSelectBankCoins();
    }
    console.log(bankCoins);
}

function totalBankCoins() {
    let sum = 0;
    bankCoins.forEach(coin => sum += coin.amount);
    return sum;
}

function unSelectBankCoins() {
    bankCoins = [];
    console.log("remove");
    document.querySelectorAll('#containerBank p').forEach(coin => coin.classList.remove("selectBankCoin"));
}

async function grabCoins() {
    if (playerName === await getGameCurrentPlayer(gameId, token)) {
        takeCoins(gameId, token, playerName, bankCoins).then(() => {
            setBank();
            setCoins();
            setTurn();
        });
    }
}