"use strict";

document.addEventListener('DOMContentLoaded', init);

const gameId = localStorage.getItem('gameId');
const token = localStorage.getItem('playerToken');
const playerName = localStorage.getItem('playerName');
const scoreboard = document.querySelector('#scoreboard dl');
const title = document.querySelector('header h2');
const bankHolder = document.querySelector('main div #containerBank');
const marketBuildings = document.querySelectorAll('#marketGrid p');

function init() {
    setScoreboard();
    setTitle();
    setBank();
    setCoins();
    setMarket();
    document.querySelector('#pspopup').addEventListener('click', showpointsystem);
    document.querySelector('.close').addEventListener('click', closepointsystem);
}

function setScoreboard() {
    getGamePlayers(gameId, token).then(players => {
        let listScoreboard = '';
        players.forEach(player => {
            listScoreboard += `<dt>${player.name}</dt><dd>${player.score}</dd>`;
        });
        scoreboard.innerHTML = listScoreboard;
    });
}

function setBank() {
    getGameProperty(gameId, token, 'bank').then(bank => {
        let coins = '';
        bank.forEach(coin => {
            coins += `<p class="${coin.currency}">${coin.amount}</p>`;
        });
        bankHolder.innerHTML = coins;
    });
}

function setTitle() {
    getGameCurrentPlayer(gameId, token).then(currentPlayer => {
        if (playerName === currentPlayer) {
            title.innerHTML = `It's your turn!`;
        } else {
            title.innerHTML = `It's the turn of ${currentPlayer}.`;
        }
    });
}

function setCoins() {
    getGamePlayers(gameId, token).then(players => {
        players.forEach(player => {
            if (player.name === playerName) {
                document.querySelectorAll('#moneyPlayer ul').forEach(list => list.innerHTML = '');
                player.coins.forEach(coin => {
                    const coinHolder = document.querySelector(`#${coin.currency}MoneyPlayer ul`);
                    coinHolder.innerHTML += `<li>${coin.amount}</li>`;
                });
            }
        });
    });
}

function setMarket() {
    getGameProperty(gameId, token, 'market').then(markets => {
        Object.keys(markets).forEach((market, index) => {
            marketBuildings[index].innerHTML = markets[market].cost;
            marketBuildings[index].style.backgroundImage = `url('./images/${markets[market].type}.jpg')`;
            marketBuildings[index].className ='';
            Object.keys(markets[market].walls).forEach(wall=>{
               if (markets[market].walls[wall]){
                   marketBuildings[index].classList.add(`${wall}Wall`);
               }
            });
        });
    });
}

function showpointsystem() {
    document.querySelector('.pointsystem').style.display = 'flex';
}

function closepointsystem() {
    document.querySelector('.pointsystem').style.display = 'none';
}

