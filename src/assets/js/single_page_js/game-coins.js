"use strict";

function setCoins() { // loads the coins in
    getGamePlayer(gameId, token, playerName).then(player => {
        document.querySelectorAll('#moneyPlayer ul').forEach(list => list.innerHTML = '');
        player.coins.sort(compareCoins).forEach(coin => {
            const coinHolder = document.querySelector(`#${coin.currency}MoneyPlayer ul`);
            coinHolder.innerHTML += `<li>${coin.amount}</li>`;
        });
        document.querySelectorAll("#moneyPlayer li").forEach(coin =>coin.addEventListener("click",selectCoin));
    });
}

function compareCoins(coin1, coin2) {
    return coin1.amount - coin2.amount;
}

