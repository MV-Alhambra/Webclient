"use strict";

let redesignOn = false;
const buildingDrag = document.querySelector("#buildingDrag");

function toggle() { //toggles between on or off when clicking the redesign button
    if (!redesign.classList.contains("toggle-on") && playerName === turnPlayer) {
        redesign.classList.add("toggle-on");
        redesign.innerHTML = "<span>redesign on</span>";
        redesignOn = true;
    } else {
        redesign.classList.remove("toggle-on");
        redesign.innerHTML = "<span>redesign off</span>";
        redesignOn = false;
    }
    refresh();//remove or add addEventListeners for redesign
}

function setRedesignSelectors() { //adds the eventListeners to make redesign functionality possible
    if (redesignOn) {
        //city to reserve
        const buildings = document.querySelectorAll("#map .building");
        buildings.forEach(building => building.addEventListener("drag", dragBuilding));
        buildings.forEach(building => building.addEventListener("dragstart", dragStartBuilding));
        buildings.forEach(building => building.addEventListener("dragend", dragEndBuilding));
        reserveWrapper.parentElement.addEventListener("drop", dropBuilding); // this triggers when an item gets dropped in it
        reserveWrapper.parentElement.addEventListener("dragover", allowDropReserve);//this sets the location where i can drop the item
        //reserve to city
        reserveWrapper.childNodes.forEach(building => building.addEventListener("drag", dragBuilding));
        reserveWrapper.childNodes.forEach(building => building.addEventListener("dragend", dragEndBuilding));
        reserveWrapper.childNodes.forEach(building => building.addEventListener("dragstart", showLocations));
    }
}

function dragBuilding(e) { //makes the building stay near the cursor
    buildingDrag.style.top = (e.clientY) + "px";
    buildingDrag.style.left = (e.clientX) + "px";
}

function showLocations(e) { //shows the locations of were the new building can be placed
    showPossibleLocations(convertBuildingToObject(e.currentTarget), addEventListenersReserveBuilding);
    dragStartBuilding(e);
    e.dataTransfer.setData("building", "reserve");
    e.dataTransfer.setData("building/reserve", null);//because js only allows me to see the content at drop
}

function allowDropMap(e) { //only allow drop for our custom drags not the random default ones like select text
    if (e.dataTransfer.types.includes("building")) { //only allows custom drag to drop
        e.preventDefault();
    }
}

function allowDropReserve(e) { //only allow drop for our custom drags not the random default ones like select text and drag it and drag from reserve to map
    if (!e.dataTransfer.types.includes("building/reserve") && e.dataTransfer.types.includes("building/map")) { //prevents dropping reserve buildings on itself
        e.preventDefault();
    }
}

function addEventListenersReserveBuilding(tile, building) { // adds the eventListeners for dropping and filtering a building on a tile
    tile.addEventListener("dragover", allowDropMap); //this sets the location where i can drop the item
    tile.addEventListener("drop", e => dropBuilding(e, building));
}

function dragStartBuilding(e) { //makes buildingDrag visible and correct and setup the filter
    e.dataTransfer.setData("building", "map");
    e.dataTransfer.setData("building/map", null);//because js only allows me to see the content at drop but then i dont need it any more ¯\_( ͡❛ ͜ʖ ͡❛)_/¯
    buildingDrag.innerHTML = e.target.outerHTML;
    e.target.classList.add("draggedBuilding");
    buildingDrag.style.top = (e.clientY) + "px";
    buildingDrag.style.left = (e.clientX) + "px";
    buildingDrag.classList.remove("hidden");
}

function dragEndBuilding() { //makes buildingDrag invisible and removes the eventListeners
    buildingDrag.classList.add("hidden");
    setReserve();
    setMap();
}

function dropBuilding(e, building) { //second and third argument only gets used when called by showLocations
    if (e.target.closest("#reserve")) {
        console.log("reserve");
        const index = parseInt(buildingDrag.firstElementChild.getAttribute("data-index"));
        setCityBuildingToReserve(gameId, token, playerName, convertIndexToLocation(index)).then(response => responseHandler(response, e));
    } else if (e.target.closest("#map")) {
        placeBuildingOnMap(e, building, setReserveBuildingToCity);
    } else {
        toggle();//in case something goes wrong it will keep the toggle the same
        console.error("hmmm");
    }
    toggle(); //turn off the redesign button
}

function convertIndexToStaticLocation(index) { //converts an index into a static location
    return {
        col: index % mapSize,
        row: parseInt(index / mapSize)
    };
}

function convertStaticToDynamicLocation(staticLocation) { //converts a static location into a dynamic/normal location
    const mapRadius = (mapSize - 1) / 2;
    return {
        row: staticLocation.row - mapRadius,
        col: staticLocation.col - mapRadius
    };
}

function convertIndexToLocation(index) { //converts an index into a dynamic/normal location
    const mapRadius = (mapSize - 1) / 2;
    return {
        col: (index % mapSize) - mapRadius,
        row: (parseInt(index / mapSize)) - mapRadius
    };
}

