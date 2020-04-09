"use strict";
let coins = [];

function setCoins() { // loads the coins in
    getGamePlayer(gameId, token, playerName).then(player => {
        document.querySelectorAll('#moneyPlayer ul').forEach(list => list.innerHTML = '');
        player.coins.sort(compareCoins).forEach(coin => {
            const coinHolder = document.querySelector(`#${coin.currency}MoneyPlayer ul`);
            coinHolder.innerHTML += `<li>${coin.amount}</li>`;
        });
        document.querySelectorAll("#moneyPlayer li").forEach(coin => coin.addEventListener("click", selectCoin));
    });
}

function compareCoins(coin1, coin2) {
    return coin1.amount - coin2.amount;
}

function selectCoin(e) {
    const classList = e.target.classList;
    const coin = convertCoinToObject(e.target);
    if (classList.contains("selectCoin")) {
        classList.remove("selectCoin");
        coins.splice(coins.findIndex(coinsCoin => coinsCoin === coin), 1);
    } else if (coins.length === 0 || coins[0].currency === coin.currency) {
        classList.add("selectCoin");
        coins.push(coin);
    } else {
        unSelectCoins();
        classList.add("selectCoin");
        coins.push(coin);
    }
    console.log(coins);
}

function unSelectCoins() { //deselect all coins
    coins = [];
    document.querySelectorAll('.selectCoin').forEach(coin => coin.classList.remove("selectCoin"));
}

function convertCoinToObject(coin) { //turns the html of a coin into an object we can use
    return {
        currency: coin.parentElement.parentElement.firstElementChild.innerHTML.toLowerCase(),
        amount: parseInt(coin.innerHTML)
    };
}
