"use strict";

let bankCoins = [];

function setBank() { // loads the bank in
    getGameProperty(gameId, token, 'bank').then(bank => {
        let coins = '';
        bank.forEach(coin => {
            if (coin !==null) {coins += `<p class="${coin.currency}">${coin.amount}</p>`;}
        });
        bankWrapper.innerHTML = coins;
        if (turnPlayer === playerName) {
            document.querySelectorAll("#containerBank p").forEach(coin => coin.addEventListener("click", selectBankCoins));
        }
    });
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
        classList.remove("selectBankCoin");
        bankCoins.splice(bankCoins.findIndex(coin => coin === convertBankCoinToObject(e)), 1);
    } else if (totalBankCoins() + parseInt(e.target.innerHTML) < 6 || bankCoins.length === 0) { //add more coins if total coins under 6
        classList.add("selectBankCoin");
        bankCoins.push(convertBankCoinToObject(e));
    } else { //select new coin
        deselectBankCoins();
        classList.add("selectBankCoin");
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
