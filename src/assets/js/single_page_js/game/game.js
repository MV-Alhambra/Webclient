"use strict";

document.addEventListener('DOMContentLoaded', init);

const gameId = localStorage.getItem('gameId');
const token = localStorage.getItem('playerToken');
const playerName = localStorage.getItem('playerName');

let scoreboard;
let title;
let bankWrapper;
let marketBuildings;
let mapWrapper;
let reserveWrapper;
let popupLeave;
let bankCoinDrag;
let city;
let cityMapTitle;
let cityMapWrapper;
let cityReserveTitle;
let cityReserveWrapper;
let coinsDrag;
let mouseError;
let hand;
let mapZoomIn;
let mapZoomOut;
let buildingDrag;
let reserve;

let colors = ["blue", "green", "orange", "yellow"];
let types = ["pavilion", "seraglio", "arcades", "chambers", "garden", "tower"];
let turnPlayer = null;
const maxMapSize = 13; //1px walls aren't visible enough

function init() {
    //game
    scoreboard = document.querySelector('#scoreboard dl');
    title = document.querySelector('header h2');
    bankWrapper = document.querySelector('#containerBank');
    marketBuildings = document.querySelectorAll('#marketGrid div');
    mapWrapper = document.querySelector("#map div");
    reserveWrapper = document.querySelector("#reserve div");
    popupLeave = document.querySelector('#popup.hidden');
    //game-bank
    bankCoinDrag = document.querySelector("#bankCoinDrag");
    //game-city
    city = document.querySelector("#city");
    cityMapTitle = document.querySelector("#cityMap h5");
    cityMapWrapper = document.querySelector("#cityMap div div");
    cityReserveTitle = document.querySelector("#cityReserve h5");
    cityReserveWrapper = document.querySelector("#cityReserve div");
    //game-coins
    coinsDrag = document.querySelector("#coinsDrag");
    //game-error
    mouseError = document.querySelector("#mouseError");
    //game-hand
    hand = document.querySelector("#hand");
    reserve = document.querySelector("#reserve");
    //game-map
    mapZoomIn = document.querySelector("#zoom_in");
    mapZoomOut = document.querySelector("#zoom_out");
    //game-redesign
    buildingDrag = document.querySelector("#buildingDrag");

    initLSMapSize();
    getBuildingTypes().then(typeList => types = typeList);// not really needed anymore but why not
    getCurrencies().then(currencies => colors = currencies);// not really needed anymore but why not
    updateMapSize();

    window.addEventListener('resize', updateMapSize);
    document.querySelector('#pspopup').addEventListener('click', showPointSystem);
    document.querySelector('#pointsystem .close').addEventListener('click', closePointSystem);
    document.querySelector("#zoom_in").addEventListener('click', () => zoomIn(mapZoomOut, setMap));
    document.querySelector("#zoom_out").addEventListener('click', () => zoomOut(mapZoomIn, setMap));
    document.querySelector('.leavePopup').addEventListener('click', confirmLeaving);
    document.querySelector('#returnToGame').addEventListener('click', closeLeave);
    document.querySelector("#city .close").addEventListener("click", closeCity);
    document.querySelector("header .Yes").addEventListener("click", leaveGamePlayer);
    document.querySelector("#manual").addEventListener("click", showManual);
    document.querySelector(".manualpopup .close").addEventListener('click', closeManual);

    polling().then();
}


function setScoreboard() { // loads the scoreboard in
    getGamePlayers(gameId, token).then(players => {
        let listScoreboard = '';
        players.forEach(player => {
            listScoreboard += `<dt data-name="${player.name}">${player.name === turnPlayer ? "☼ " + player.name : player.name}</dt><dd>${player.score}</dd>`;
        });
        scoreboard.innerHTML = listScoreboard;
        document.querySelectorAll("#scoreboard dt").forEach(player => player.addEventListener("click", showCity));
    });
}

function setTurn() { // loads the current persons turn in
    if (playerName === turnPlayer) {
        title.innerHTML = `It's your turn!`;
    } else {
        title.innerHTML = `Now playing : <span>${turnPlayer}</span>`;
    }
}

function showPointSystem() { //makes the point system visible
    document.querySelector('#pointsystem').classList.add("flex");
}

function updateMapSize() { //Makes the map square, so far only works when height is bigger than width
    mapWrapper.style.width = mapWrapper.clientHeight + "px";
    cityMapWrapper.style.width = cityMapWrapper.clientHeight + "px";
}

function closePointSystem() { //hides the point system
    document.querySelector('#pointsystem').classList.remove("flex");
}

function confirmLeaving(e) { //opens the confirm leaving dialog
    e.preventDefault();
    popupLeave.classList.remove("hidden");
}

function closeLeave(e) { //closes the confirm leaving dialog
    e.preventDefault();
    popupLeave.classList.add("hidden");
}

function closeCity() {
    city.classList.remove("flex");
}

function refresh() { //loads everything in
    setTurn();
    setReserve();
    setMap();
    setBank();
    setCoins();
    setMarket();
    setScoreboard();
    setCounters();
}

function responseHandler(response, event, dynamic = true) { // this function handles all the responses of the actions of the player
    if (response.ok) {
        if (dynamic) {
            dynamicUpdater().then();
        } else {
            refresh();
        }
    } else {
        response.json().then(error => {
            console.clear();//removes the error from the console
            showError(error.cause, event); //shows the custom error from the server
        });
    }
}

async function polling() { //recursion function that stops when the game is over
    if (await getGameProperty(gameId, token, "ended")) {
        window.location.replace('./end_game.html');
    } else {
        await dynamicUpdater();
        setTimeout(() => polling(), 2000);
    }
}

async function dynamicUpdater() { //this function updates all the fields only if it's a new turn
    const currentPlayer = await getGameCurrentPlayer(gameId, token);
    if (!turnPlayer || turnPlayer !== currentPlayer) {//only update everything when the turn is over or else you lose the currently selected items
        turnPlayer = currentPlayer;
        refresh();
    }
}

function createBuilding(building, index = -1, canBeDragged = false) { //receives an building object and turns it into html for a building
    if (building === null) {
        return `<p></p>`;
    } else if (building.cost === 0) {
        return `<p class="fountain"></p>`;
    } else {
        let walls = '';
        Object.keys(building.walls).forEach(wall => {
            if (building.walls[wall]) {
                walls += wall + "Wall ";
            }
        });
        if (index === -1) {
            return `<p class="building ${building.type} ${walls}" draggable="${canBeDragged}">${building.cost}</p>`;
        } else {

            return `<p class="building ${building.type} ${walls}" data-index="${index}" draggable="${canBeDragged}">${building.cost}</p>`;
        }
    }
}

function leaveGamePlayer(e) { //leaves the game
    e.preventDefault();
    leaveGame(gameId, token, playerName).then(response => response ? window.location.replace('./index.html') : null);
}

function convertBuildingToObject(building) { //turns the html of a building into an object of an building
    const classList = building.classList;
    return {
        type: getType(classList),
        cost: parseInt(building.innerHTML),
        walls: {
            north: classList.contains("northWall"),
            east: classList.contains("eastWall"),
            south: classList.contains("southWall"),
            west: classList.contains("westWall")
        }
    };
}

function getType(classList) {
    return types.find(type => classList.contains(type));
}

function convertStaticLocationToIndex(staticLocation) { //turns the static location into the correct index for the tile on the map
    return (staticLocation.row * mapSize) + staticLocation.col;
}

function convertLocationToIndex(location) {
    return convertStaticLocationToIndex(convertDynamicToStaticLocation(location));
}

function convertDynamicToStaticLocation(location) { //turns the dynamic location/location based around fountain into location based on top left
    const mapRadius = (mapSize - 1) / 2;
    return {
        row: location.row + mapRadius,
        col: location.col + mapRadius
    };
}

function convertStaticToDynamicLocation(staticLocation) { //converts a static location into a dynamic/normal location
    const mapRadius = (mapSize - 1) / 2;
    return {
        row: staticLocation.row - mapRadius,
        col: staticLocation.col - mapRadius
    };
}

function convertIndexToStaticLocation(index) { //converts an index into a static location
    return {
        col: index % mapSize,
        row: parseInt(index / mapSize)
    };
}

function convertIndexToLocation(index) { //converts an index into a dynamic/normal location
    const mapRadius = (mapSize - 1) / 2;
    return {
        col: (index % mapSize) - mapRadius,
        row: (parseInt(index / mapSize)) - mapRadius
    };
}

function showManual() {
    document.querySelector('.manualpopup').style.display = 'flex';
}

function closeManual() { //hides the manual
    document.querySelector('.manualpopup').style.display = 'none';
}
