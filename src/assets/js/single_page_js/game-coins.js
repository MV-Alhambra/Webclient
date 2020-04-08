"use strict";

function convertCoinToObject(e) {
    return  {
        currency: e.target.className,
        amount: parseInt(e.target.innerHTML)
    };
}

function selectBankCoins(e) {


}