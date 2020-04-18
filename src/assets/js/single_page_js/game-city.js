"use strict";

const city = document.querySelector("#city");
const cityMapTitle = document.querySelector("#cityMap h1");
const cityMapWrapper = document.querySelector("#cityMap div div");
const cityReserveTitle = document.querySelector("#cityReserve h1");
const cityReserveWrapper = document.querySelector("#cityReserve div");
const cityZoomOut = document.querySelector("#zoom_out_city");
const cityZoomIn = document.querySelector("#zoom_in_city");
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
        setMap();
        updateMapSize();
        zoomButtonCityHider();
        cityMapWrapper.className = 'map' + mapSize;//set the size of the map
        cityMapWrapper.innerHTML = "";
        convertCityToMap(city).forEach(row => {
            row.forEach(cell => cityMapWrapper.innerHTML += createBuilding(cell));
        });
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