"use strict";

const city = document.querySelector("#city");
const cityMapTitle = document.querySelector("#cityMap h1");
const cityMapWrapper = document.querySelector("#cityMap div div");
const cityReserveTitle = document.querySelector("#cityReserve h1");
const cityReserveWrapper = document.querySelector("#cityReserve div");
let cityZoomOut = null
let cityZoomIn = null
let name = null;

function showCity(e) {
    name = e.currentTarget.innerHTML;
    city.classList.add("flex");
    cityMapTitle.innerHTML = "The town of " + name;
    setCity(name);
    cityReserveTitle.innerHTML = "Reserve buildings of " + name;
}


function setCity() { // loads in the map
    getGamePlayerProperty(gameId, token, name, "city").then(city => {
        setMap();//make the map stay sync
        updateMapSize();
        cityMapWrapper.className = 'map' + mapSize;//set the size of the map
        cityMapWrapper.innerHTML = `<aside><p id="zoom_in_city">+</p><p id="zoom_out_city">-</p></aside>`;
        convertCityToMap(city).forEach(row => row.forEach(cell => cityMapWrapper.innerHTML += createBuilding(cell)));
        cityZoomIn = document.querySelector("#zoom_in_city");
        cityZoomOut = document.querySelector("#zoom_out_city")
        cityZoomIn.addEventListener('click', zoomInCity);
        cityZoomOut.addEventListener('click', zoomOutCity);
        zoomButtonCityHider();
    });
    getGamePlayerProperty(gameId, token, name, "reserve").then(reserve => {
        let reserveBuildings = '';
        reserve.forEach(building => reserveBuildings += createBuilding(building));
        cityReserveWrapper.innerHTML = reserveBuildings;
    });
}

function zoomInCity() { // changes the mapSize and holds logic for the buttons
    if (mapSize !== 3) {
        if (mapSize === 9) {
            cityZoomOut.classList.remove("inactive");
        }
        mapSize -= 2;
        localStorage.setItem("mapsize", mapSize);
        setCity();
    }
}

function zoomOutCity() {  // changes the mapSize and holds logic for the buttons
    if (mapSize !== 9) {
        if (mapSize === 3) {
            cityZoomIn.classList.remove("inactive");
        }
        mapSize += 2;
        localStorage.setItem("mapsize", mapSize);
        setCity();
    }
}

function zoomButtonCityHider() { //logic for making the buttons invisible
    if (mapSize === 9) {
        cityZoomOut.classList.add("inactive");
    } else if (mapSize === 3) {
        cityZoomIn.classList.add("inactive");
    }
}