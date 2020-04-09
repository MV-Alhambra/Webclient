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
let colors = ["blue", "green", "orange", "yellow"];
let types = ["pavilion", "seraglio", "arcades", "chambers", "garden", "tower"];

function init() {
    getBuildingTypes().then(typeList => types = typeList);// not really needed anymore but why not
    getCurrencies().then(currencies => colors = currencies);// not really needed anymore but why not
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
    document.querySelector("#take_money").addEventListener("click", grabCoins);
    document.querySelector('.leavePopup').addEventListener('click', confirmLeaving);
    document.querySelector('#returnToGame').addEventListener('click', closePopup);
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

function setTurn() { // loads the current persons turn in
    getGameCurrentPlayer(gameId, token).then(currentPlayer => {
        if (playerName === currentPlayer) {
            title.innerHTML = `It's your turn!`;
        } else {
            title.innerHTML = `It's the turn of ${currentPlayer}.`;
        }
    });
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

function confirmLeaving(e) {
    e.preventDefault();
    const popup = document.querySelector('.hidden');
    popup.style.display = "inline";
}

function closePopup(e) {
    e.preventDefault();
    const popup = document.querySelector('.hidden');
    popup.style.display = "none";
}


