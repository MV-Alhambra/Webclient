"use strict";

document.addEventListener('DOMContentLoaded', init);

const gameId = localStorage.getItem('gameId');
const token = localStorage.getItem('playerToken');
const playerName = localStorage.getItem('playerName');
const scoreboard = document.querySelector('#scoreboard dl');
const title = document.querySelector('header h2');
const bankHolder = document.querySelector('main div #containerBank');
const marketBuildings = document.querySelectorAll('#marketGrid div');
const mapWrapper = document.querySelector("#map div");
let mapSize = 3;

function init() {
    setScoreboard();
    setTitle();
    setBank();
    setCoins();
    setMarket();
    updateMapSize();
    setMap();
    window.addEventListener('resize', updateMapSize);
    document.querySelector('#pspopup').addEventListener('click', showpointsystem);
    document.querySelector('.close').addEventListener('click', closepointsystem);
}

function setScoreboard() { // loads the scoreboard in
    getGamePlayers(gameId, token).then(players => {
        let listScoreboard = '';
        players.forEach(player => {
            listScoreboard += `<dt>${player.name}</dt><dd>${player.score}</dd>`;
        });
        scoreboard.innerHTML = listScoreboard;
    });
}

function setBank() { // loads the bank in
    getGameProperty(gameId, token, 'bank').then(bank => {
        let coins = '';
        bank.forEach(coin => {
            coins += `<p class="${coin.currency}">${coin.amount}</p>`;
        });
        bankHolder.innerHTML = coins;
    });
}

function setTitle() { // loads the current persons turn in
    getGameCurrentPlayer(gameId, token).then(currentPlayer => {
        if (playerName === currentPlayer) {
            title.innerHTML = `It's your turn!`;
        } else {
            title.innerHTML = `It's the turn of ${currentPlayer}.`;
        }
    });
}

function setCoins() { // loads the coins in
    getGamePlayer(gameId, token, playerName).then(player => {
        document.querySelectorAll('#moneyPlayer ul').forEach(list => list.innerHTML = '');
        player.coins.forEach(coin => {
            const coinHolder = document.querySelector(`#${coin.currency}MoneyPlayer ul`);
            coinHolder.innerHTML += `<li>${coin.amount}</li>`;
        });
    });
}

function setMarket() { // loads the market in
    getGameProperty(gameId, token, 'market').then(markets => {
        Object.keys(markets).forEach((market, index) => { //object.keys turns an objects its keys into an array with index holding the original order
            marketBuildings[index].innerHTML = createBuilding(markets[market]);
        });
    });
}

function setMap() { // loads in the map
    getGamePlayerProperty(gameId, token, playerName, "city").then(city => {
        mapWrapper.innerHTML = '';
        convertCityToMap(city).forEach(row => {
            row.forEach(cell => {
                mapWrapper.innerHTML += createBuilding(cell);
            })
        })
    });
}

function convertCityToMap(city) { //converts the city into the size of the map
    const map = new Array(mapSize).fill(null).map(() => new Array(mapSize).fill(null)); //creates an empty 2 dimensional array
    const cityCenter = (city.length + 1) / 2;//3
    const mapCenter = (mapSize + 1) / 2;//2
    const diffCenter = Math.abs(cityCenter - mapCenter);
    if (cityCenter > mapCenter) {
        for (let row = 0; row < mapSize; row++) {
            for (let col = 0; col < mapSize; col++) {
                map[row][col] = city[row + diffCenter][col + diffCenter];
            }
        }
    } else if (cityCenter < mapCenter) {
        const citySize = city.length;
        for (let row = 0; row < citySize; row++) {
            for (let col = 0; col < citySize; col++) {
                map[row + diffCenter][col + diffCenter] = city[row][col];
            }
        }
    } else {
        return city;
    }
    return map;
}

function createBuilding(building) { //receives an building object and turns it into html for a building
    if (building === null) {
        return `<p></p>`;
    } else if (building.cost === 0) {
        return `<p class="fountain building"></p>`;
    } else {
        let walls = '';
        Object.keys(building.walls).forEach(wall => {
            if (building.walls[wall]) {
                walls += wall + "Wall ";
            }
        });
        return `<p class="building ${building.type} ${walls}">${building.cost}</p>`;
    }
}

function showpointsystem() {
    document.querySelector('.pointsystem').style.display = 'flex';
}

function updateMapSize() { //Makes the map square, so far only works when height is bigger than width
    const height = mapWrapper.clientHeight;
    mapWrapper.style.width = height + "px";
}

function closepointsystem() {
    document.querySelector('.pointsystem').style.display = 'none';
}

