"use strict";

let bankCoins = [];

function setCoins() { // loads the coins in
    getGamePlayer(gameId, token, playerName).then(player => {
        document.querySelectorAll('#moneyPlayer ul').forEach(list => list.innerHTML = '');
        player.coins.forEach(coin => {
            const coinHolder = document.querySelector(`#${coin.currency}MoneyPlayer ul`);
            coinHolder.innerHTML += `<li>${coin.amount}</li>`;
        });
    });
}

function convertCoinToObject(e) { //turns the html of a coin into an object we can use
    const coin = e.target.classList;
    const filteredCurrency = coin.contains("yellow") ? "yellow" : coin.contains("orange") ? "orange" : coin.contains("blue") ? "blue" : "green";
    return {
        currency: filteredCurrency,
        amount: parseInt(e.target.innerHTML)
    };
}

function selectBankCoins(e) { //selector logic for the coins
    const classList = e.target.classList;
    if (classList.contains("selectBankCoin")) { //unselect selected coin
        classList.remove("selectBankCoin");
        bankCoins.splice(bankCoins.findIndex(coin => coin === convertCoinToObject(e)), 1);
    } else if (totalBankCoins() + parseInt(e.target.innerHTML) < 6 || bankCoins.length === 0) { //add more coins if total coins under 6
        classList.add("selectBankCoin");
        bankCoins.push(convertCoinToObject(e));
    } else if (!classList.contains("selectBankCoin")) { //select new coin
        unSelectBankCoins();
        classList.add("selectBankCoin");
        bankCoins.push(convertCoinToObject(e));
    }
}

function totalBankCoins() { //gives total amount of value of coins back
    let sum = 0;
    bankCoins.forEach(coin => sum += coin.amount);
    return sum;
}

function unSelectBankCoins() { //deselect all coins
    bankCoins = [];
    document.querySelectorAll('#containerBank p').forEach(coin => coin.classList.remove("selectBankCoin"));
}

async function grabCoins() { //send selected coins to the server
    if (playerName === await getGameCurrentPlayer(gameId, token)) {
        takeCoins(gameId, token, playerName, bankCoins).then(() => {
            setBank();
            setCoins();
            setTurn();
        });
    }
}
