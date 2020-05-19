"use strict";

const gameId = localStorage.getItem('gameId');
const playerName = localStorage.getItem('playerName');
const token = localStorage.getItem('playerToken');

const scoreBoard = document.querySelector('#players');
const winOrLose = document.querySelector('h1');

const city = document.querySelector("#city");
const cityMapTitle = document.querySelector("#cityMap h5");
const cityMapWrapper = document.querySelector("#cityMap div div");
const cityReserveTitle = document.querySelector("#cityReserve h5");
const cityReserveWrapper = document.querySelector("#cityReserve div");
let cityZoomOut = null;
let cityZoomIn = null;
const reserveWrapper = document.querySelector("#reserve div");
let mapSize = 3;
let maxMapSize = 13;



document.addEventListener('DOMContentLoaded', init);


function init() {
    getPlayersAndScore().then(response => {
        console.log(response);
        loadInScore(response);
        checkWin(response);
        document.querySelector('section a').addEventListener('click', showCity)
    });
}


function loadInScore(playersScore) {
    scoreBoard.innerHTML = "";
    playersScore.forEach((player, index) =>
        scoreBoard.innerHTML += `<section>
        <h2>${index + 1}</h2>
        <h3>${player.name}</h3>
        <h4>${player.score}</h4>
        <h5>Title:</h5>
        <h6>Description</h6>
        <a href="#" data-name="${player.name}">Show village</a>
    </section>`);
}

function getPlayersAndScore() { // loads the scoreboard in
    return getGamePlayers(gameId, token).then(players => {
        console.log(players);
        const scoreboard = [];
        players.forEach(player => {
            scoreboard.push({name: player.name, score: player.score});
        });
        return orderByScore(scoreboard);
    });
}

function orderByScore(scoreboard) {
    scoreboard.sort(function (a, b) {
        return b.score - a.score;
    });
    return scoreboard;
}

function checkWin(response) {
    console.log(response);
    if (response[0].name === playerName) {
        winOrLose.innerText = "Victory!";
    } else {
        winOrLose.innerText = "Better luck next time ...";
    }
}

function showCity(e) {
    let nameOfCity;
    nameOfCity = e.currentTarget.getAttribute("data-name");
    console.log(nameOfCity);
    cityMapTitle.innerHTML = `The town of <span> ${name}</span>`;
    setCity(nameOfCity);
    cityReserveTitle.innerHTML = "Reserve buildings of " + name;
}


function setCity(nameOfCity) { // loads in the map
    console.log(name);
    getGamePlayerProperty(gameId, token, nameOfCity, "city").then(cityMap => {
        cityMapWrapper.className = 'map' + mapSize;//set the size of the map
        cityMapWrapper.innerHTML = `<aside><p id="zoom_in_city">+</p><p id="zoom_out_city">-</p></aside>`;
        convertCityToMap(cityMap).forEach(row => row.forEach(cell => cityMapWrapper.innerHTML += createBuilding(cell)));
        cityZoomIn = document.querySelector("#zoom_in_city");
        cityZoomOut = document.querySelector("#zoom_out_city");
        cityZoomIn.addEventListener('click', () => zoomIn(cityZoomOut, setCity));
        cityZoomOut.addEventListener('click', () => zoomOut(cityZoomIn, setCity));
        zoomButtonHider(cityZoomIn, cityZoomOut);
    });
    getGamePlayerProperty(gameId, token, name, "reserve").then(reserve => {
        let reserveBuildings = '';
        reserve.forEach(building => reserveBuildings += createBuilding(building));
        cityReserveWrapper.innerHTML = reserveBuildings;
    });
}

function zoomButtonHider(btnZoomIn, btnZoomOut) { //logic for making the buttons invisible
    if (mapSize === maxMapSize) {
        btnZoomOut.classList.add("inactive");
    } else if (mapSize === 3) {
        btnZoomIn.classList.add("inactive");
    }else{
        btnZoomOut.classList.remove("inactive");
        btnZoomIn.classList.remove("inactive");
    }
}


function convertCityToMap(city) { //converts the city into the size of the map
    const map = [...Array(mapSize)].map(() => Array(mapSize).fill(null)); //creates an empty/null 2 dimensional array
    const cityCenter = (city.length + 1) / 2;
    const mapCenter = (mapSize + 1) / 2;
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

function zoomIn(btnZoomOut, setFunction) { // changes the mapSize and holds logic for the buttons
    if (mapSize !== 3) {
        if (mapSize === maxMapSize) {
            btnZoomOut.classList.remove("inactive");
        }
        mapSize -= 2;
        localStorage.setItem("mapsize", mapSize);
        setFunction();
    }
}

function zoomOut(btnZoomIn, setFunction) {  // changes the mapSize and holds logic for the buttons
    if (mapSize !== maxMapSize) {
        if (mapSize === 3) {
            btnZoomIn.classList.remove("inactive");
        }
        mapSize += 2;
        localStorage.setItem("mapsize", mapSize);
        setFunction();
    }
}



