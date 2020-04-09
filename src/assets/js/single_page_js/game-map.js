"use strict";

let mapSize = 5;

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
