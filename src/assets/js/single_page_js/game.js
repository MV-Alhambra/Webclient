"use strict";

document.addEventListener('DOMContentLoaded', init);

const gameId = localStorage.getItem('gameId');
const token = localStorage.getItem('playerToken');
const playerName = localStorage.getItem('playerName');
const scoreboard = document.querySelector('#scoreboard dl');
const title = document.querySelector('header h2');
const bankWrapper = document.querySelector('#containerBank');
const marketBuildings = document.querySelectorAll('#marketGrid div');
const mapWrapper = document.querySelector("#map div");
const reserveWrapper = document.querySelector("#reserve div");
let mapSize = 5;

function init() {
    setScoreboard();
    setTurn();
    setBank();
    setCoins();
    setMarket();
    updateMapSize();
    setMap();
    setReserve();
    window.addEventListener('resize', updateMapSize);
    document.querySelector('#pspopup').addEventListener('click', showpointsystem);
    document.querySelector('.close').addEventListener('click', closepointsystem);
    document.querySelector("#zoom_in").addEventListener('click', zoomIn);
    document.querySelector("#zoom_out").addEventListener('click', zoomOut);
    document.querySelector("#take_money").addEventListener("click", grabCoins)
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
        bankWrapper.innerHTML = coins;
        getGameCurrentPlayer(gameId, token).then(currentPlayer => {
            if (currentPlayer === playerName) {
                document.querySelectorAll("#containerBank p").forEach(coin => coin.addEventListener("click", selectBankCoins));
            }
        });
    });
}

function setTurn() { // loads the current persons turn in
    getGameCurrentPlayer(gameId, token).then(currentPlayer => {
        if (playerName === currentPlayer) {
            title.innerHTML = `It's your turn!`;
        } else {
            title.innerHTML = `It's the turn of ${currentPlayer}.`;
        }
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
        mapWrapper.className = 'map' + mapSize;//set the size of the map
        mapWrapper.innerHTML = '';
        convertCityToMap(city).forEach(row => {
            row.forEach(cell => {
                mapWrapper.innerHTML += createBuilding(cell);
            });
        });
    });
}

function convertCityToMap(city) { //converts the city into the size of the map
    const map = [...Array(mapSize)].map(() => Array(mapSize).fill(null)); //creates an empty 2 dimensional array
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

function zoomIn(e) {
    if (mapSize !== 3) {
        if (mapSize === 9) {
            document.querySelector("#zoom_out").classList.remove("inactive");
        }
        mapSize -= 2;
        if (mapSize === 3) {
            e.target.classList.add("inactive");
        }
        setMap();
    }
}

function zoomOut(e) {
    if (mapSize !== 9) {
        if (mapSize === 3) {
            document.querySelector("#zoom_in").classList.remove("inactive");
        }
        mapSize += 2;
        if (mapSize === 9) {
            e.target.classList.add("inactive");
        }
        setMap();
    }
}

function setReserve() {
    getGamePlayerProperty(gameId, token, playerName, "reserve").then(reserve => {
        let reserveBuildings = '';
        reserve.forEach(building => {
            reserveBuildings += createBuilding(building);
        });
        reserveWrapper.innerHTML = reserveBuildings;
    });
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

