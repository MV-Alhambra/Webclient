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
let turnPlayer = null;

function init() {
    initLSMapSize();
    getBuildingTypes().then(typeList => types = typeList);// not really needed anymore but why not
    getCurrencies().then(currencies => colors = currencies);// not really needed anymore but why not
    updateMapSize();
    window.addEventListener('resize', updateMapSize);
    document.querySelector('#pspopup').addEventListener('click', showPointsystem);
    document.querySelector('.close').addEventListener('click', closePointsystem);
    document.querySelector("#zoom_in").addEventListener('click', zoomIn);
    document.querySelector("#zoom_out").addEventListener('click', zoomOut);
    document.querySelector("#take_money").addEventListener("click", grabCoins);
    document.querySelector("#buy_building").addEventListener("click", grabBuilding);
    document.querySelector('.leavePopup').addEventListener('click', confirmLeaving);
    document.querySelector('#returnToGame').addEventListener('click', closePopup);
    polling().then();
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
    if (playerName === turnPlayer) {
        title.innerHTML = `It's your turn!`;
    } else {
        title.innerHTML = `It's the turn of ${turnPlayer}.`;
    }
}

function setReserve() { // loads in the reserve
    getGamePlayerProperty(gameId, token, playerName, "reserve").then(reserve => {
        let reserveBuildings = '';
        reserve.forEach(building => {
            reserveBuildings += createBuilding(building);
        });
        reserveWrapper.innerHTML = reserveBuildings;
    });
}

function placeBuildingInReserve(e, building) { //places the building that's in the hand into the reserve
    placeBuilding(gameId, token, playerName, building, null).then(response => responseHandler(response, e));
}

function showPointsystem() { //makes the point system visible
    document.querySelector('.pointsystem').style.display = 'flex';
}

function updateMapSize() { //Makes the map square, so far only works when height is bigger than width
    const height = mapWrapper.clientHeight;
    mapWrapper.style.width = height + "px";
}

function closePointsystem() { //hides the point system
    document.querySelector('.pointsystem').style.display = 'none';
}

function confirmLeaving(e) { //opens the confirm leaving dialog
    e.preventDefault();
    const popup = document.querySelector('.hidden');
    popup.style.display = "inline";
}

function closePopup(e) { //closes the confirm leaving dialog
    e.preventDefault();
    const popup = document.querySelector('.hidden');
    popup.style.display = "none";
}

function refresh() { //loads everything in
    setTurn();
    setReserve();
    setMap();
    setBank();
    setCoins();
    setMarket();
    setScoreboard();
}

function responseHandler(response, event) { // this function handles all the response of the actions of the player
    if (response.ok) {
        refresh();
    } else {
        response.json().then(error => {
            console.clear();//removes the error from the console
            showError(error.cause, event); //shows the custom error from the server
        });
    }
}

async function polling() { //this function updates all the fields if they change
    if (await getGameProperty(gameId, token, "ended")) {
        window.location.replace('./end_game.html');
    } else {
        const currentPlayer = await getGameCurrentPlayer(gameId, token);
        if (!turnPlayer || turnPlayer !== currentPlayer) {//only update everything when the turn is over else you lose the selected items
            turnPlayer = currentPlayer;
            refresh();
        }
        setTimeout(() => polling(), 2000);
    }
}


