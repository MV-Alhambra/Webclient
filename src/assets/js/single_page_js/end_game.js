"use strict";

const gameId = localStorage.getItem('gameId');
const playerName = localStorage.getItem('playerName');
const token = localStorage.getItem('playerToken');

let scoreBoard;
let winOrLose;
let cityMap;
let cityMapTitle;
let cityMapWrapper;
let reserveWrapper;
let cityZoomOut = null;
let cityZoomIn = null;
let mapSize = 3;
const maxMapSize = 13;
let nameOfCity = null;

document.addEventListener('DOMContentLoaded', init);

function init() {
    window.addEventListener('resize', updateMapSize);
    document.querySelector("#city .close").addEventListener("click", closeCity);
    scoreBoard = document.querySelector('#players');
    winOrLose = document.querySelector('h1');
    cityMap = document.querySelector("#city");
    cityMapTitle = document.querySelector("#cityMap h5");
    cityMapWrapper = document.querySelector("#cityMap div div");
    reserveWrapper = document.querySelector("#reserve div");

    updateMapSize();
    getSortedPlayers().then(response => {
        loadInScore(response);
        checkWin(response);
        document.querySelectorAll('#players section a').forEach(a => a.addEventListener('click', showCity));
    });

}

function loadInScore(playersScore) {
    scoreBoard.innerHTML = "";
    playersScore.forEach((player, index) =>
        scoreBoard.innerHTML += `<section>
        <h2>${index + 1}</h2>
        <h3>${player.name}</h3>
        <h4>${player.score} points</h4>
        <h5>${player.title !== null ? player.title.role : "\n" }</h5>
        <h6>${player.title !== null ? player.title.description : "\n\n"}</h6>
        <h6>${player.title !== null && player.title.value.charAt(0) !== "0" ? player.title.value : "\n"}</h6>
        <a href="#" data-name="${player.name}">Show village</a>
    </section>`);
}

function getSortedPlayers() { // sorts the players
    return getGamePlayers(gameId, token).then(players => {
        return players.sort( (a,b) => b.score - a.score);
    });
}

function checkWin(response) {
    if (response[0].name === playerName) {
        winOrLose.innerText = "Victory!";
    } else {
        winOrLose.innerText = "Better luck next time ...";
    }
}

function showCity(e) {
    nameOfCity = e.target.getAttribute("data-name");
    document.querySelector('.popup').classList.add('flex');
    cityMapTitle.innerHTML = `The town of <span> ${nameOfCity}</span>`;
    setCity();
}

function setCity() { // loads in the map
    getGamePlayerProperty(gameId, token, nameOfCity, "city").then(city => {
        updateMapSize();
        cityMapWrapper.className = 'map' + mapSize;//set the size of the map
        cityMapWrapper.innerHTML = `<aside><p id="zoom_in_city">+</p><p id="zoom_out_city">-</p></aside>`;
        convertCityToMap(city).forEach(row => row.forEach(cell => cityMapWrapper.innerHTML += createBuilding(cell)));
        cityZoomIn = document.querySelector("#zoom_in_city");
        cityZoomOut = document.querySelector("#zoom_out_city");
        cityZoomIn.addEventListener('click', () => zoomIn(cityZoomOut, setCity));
        cityZoomOut.addEventListener('click', () => zoomOut(cityZoomIn, setCity));
        zoomButtonHider(cityZoomIn, cityZoomOut);
    });
}

function updateMapSize() { //Makes the map square, so far only works when height is bigger than width
    cityMapWrapper.style.width = cityMapWrapper.clientHeight + "px";
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

function zoomButtonHider(btnZoomIn, btnZoomOut) { //logic for making the buttons invisible
    if (mapSize === maxMapSize) {
        btnZoomOut.classList.add("inactive");
    } else if (mapSize === 3) {
        btnZoomIn.classList.add("inactive");
    } else {
        btnZoomOut.classList.remove("inactive");
        btnZoomIn.classList.remove("inactive");
    }
}

function convertCityToMap(city) { //converts the city into the size of the map
    const map = [...Array(mapSize)].map(() => Array(mapSize).fill(null)); //creates an empty/null 2 dimensional array
    const mapCenter = (mapSize + 1) / 2;
    const cityCenter = (city.length + 1) / 2;
    const diffCenter = Math.abs(cityCenter - mapCenter);
    if (cityCenter < mapCenter) {
        const citySize = city.length;
        for (let row = 0; row < citySize; row++) {
            for (let col = 0; col < citySize; col++) {
                map[row + diffCenter][col + diffCenter] = city[row][col];
            }
        }
    } else if (cityCenter > mapCenter) {
        for (let row = 0; row < mapSize; row++) {
            for (let col = 0; col < mapSize; col++) {
                map[row][col] = city[row + diffCenter][col + diffCenter];
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
        return `<p class="fountain"></p>`;
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

function closeCity() {
    cityMap.classList.remove("flex");
}


