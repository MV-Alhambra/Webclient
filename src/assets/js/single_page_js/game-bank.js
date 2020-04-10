"use strict";

let bankCoins = [];


function setBank() { // loads the bank in
    getGameProperty(gameId, token, 'bank').then(bank => {
        let coins = '';
        bank.forEach(coin => {
            coins += `<p class="${coin.currency}">${coin.amount}</p>`;
        });
        bankWrapper.innerHTML = coins;
        getGameCurrentPlayer(gameId, token).then(currentPlayer => {
            if (currentPlayer === playerName) {
                document.querySelectorAll("#containerBank p").forEach(coin => coin.addEventListener("click", selectBankCoins));
            }
        });
    });
}

function convertBankCoinToObject(e) { //turns the html of a coin into an object we can use
    return {
        currency: getColor(e.target.classList),
        amount: parseInt(e.target.innerHTML)
    };
}

function selectBankCoins(e) { //selector logic for the coins
    unSelectCoins();
    unSelectMarketBuilding();
    const classList = e.target.classList;
    if (classList.contains("selectBankCoin")) { //unselect selected coin
        classList.remove("selectBankCoin");
        bankCoins.splice(bankCoins.findIndex(coin => coin === convertBankCoinToObject(e)), 1);
    } else if (totalBankCoins() + parseInt(e.target.innerHTML) < 6 || bankCoins.length === 0) { //add more coins if total coins under 6
        classList.add("selectBankCoin");
        bankCoins.push(convertBankCoinToObject(e));
    } else{ //select new coin
        unSelectBankCoins();
        classList.add("selectBankCoin");
        bankCoins.push(convertBankCoinToObject(e));
    }
}

function getColor(classList) {
    return colors.find(color => classList.contains(color));
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
         refresh();
        });
    }
}
