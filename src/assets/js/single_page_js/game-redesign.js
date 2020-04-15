"use strict";

let redesignOn = false;
const buildingDrag = document.querySelector("#buildingDrag");

function toggle() {
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

function addRedesignSelectors() {
    if (redesignOn) {
        //city to reserve
        const buildings = document.querySelectorAll("#map .building");
        buildings.forEach(building => building.addEventListener("drag", dragBuilding));
        buildings.forEach(building => building.addEventListener("dragstart", dragBuildingStart));
        buildings.forEach(building => building.addEventListener("dragend", dragBuildingEnd));
        reserveWrapper.parentElement.addEventListener("drop", dragBuildingDrop); // this triggers when an item gets dropped in it
        reserveWrapper.parentElement.addEventListener("dragover", allowDropReserve);//this sets the location where i can drop the item
        //reserve to city
        reserveWrapper.childNodes.forEach(building => building.addEventListener("drag", dragBuilding));
        reserveWrapper.childNodes.forEach(building => building.addEventListener("dragend", dragBuildingEnd));
        reserveWrapper.childNodes.forEach(building => building.addEventListener("dragstart", showLocations));
    }
}

function dragBuilding(e) {
    buildingDrag.style.top = (e.clientY) + "px";
    buildingDrag.style.left = (e.clientX) + "px";

}

function showLocations(e) {
    showPossibleLocations(convertBuildingToObject(e.currentTarget), addEventListenersRelocateBuilding);
    dragBuildingStart(e);
    e.dataTransfer.setData("building", "reserve");
    e.dataTransfer.setData("building/reserve",null);//because js only allows me to see the content at drop
}

function allowDropMap(e) { //only allow drop for our custom drags not the random default ones like select text and drag it and drag from map to reserve
    if (e.dataTransfer.types.includes("building")) { //only allows custom drag to drop
        e.preventDefault();
    }
}

function allowDropReserve(e) { //only allow drop for our custom drags not the random default ones like select text and drag it and drag from reserve to map
    if (!e.dataTransfer.types.includes("building/reserve") && e.dataTransfer.types.includes("building/map")) { //first prevents default items second prevents dropping on itself
        e.preventDefault();
    }
}

function addEventListenersRelocateBuilding(tile, building) {
    tile.addEventListener("dragover", allowDropMap); //this sets the location where i can drop the item
    tile.addEventListener("drop", e => dragBuildingDrop(e, building));
}

function dragBuildingStart(e) {
    e.dataTransfer.setData("building", "map");
    e.dataTransfer.setData("building/map",null);//because js only allows me to see the content at drop
    buildingDrag.innerHTML = e.target.outerHTML;
    e.target.classList.add("draggedBuilding");
    buildingDrag.style.top = (e.clientY) + "px";
    buildingDrag.style.left = (e.clientX) + "px";
    buildingDrag.classList.remove("hidden");
}

function dragBuildingEnd() {
    buildingDrag.classList.add("hidden");
    setReserve();
    setMap();
}

function dragBuildingDrop(e, building) { //second and third argument only gets used when called by showLocations
    if (e.target.closest("#reserve")) {
        console.log("reserve");
        const index = parseInt(buildingDrag.firstElementChild.getAttribute("data-index"));
        setCityBuildingToReserve(gameId, token, playerName, convertIndexToLocation(index)).then(response => responseHandler(response, e));
    } else if (e.target.closest("#map")) {
        placeBuildingOnMap(e, building, setReserveBuildingToCity);
    } else {
        console.log("else");
    }
    toggle();
}

function convertIndexToStaticLocation(index) {
    return {
        col: index % mapSize,
        row: parseInt(index / mapSize)
    };
}

function convertStaticToDynamicLocation(staticLocation) {
    const mapRadius = (mapSize - 1) / 2;
    return {
        row: staticLocation.row - mapRadius,
        col: staticLocation.col - mapRadius
    };
}

function convertIndexToLocation(index) {
    const mapRadius = (mapSize - 1) / 2;
    return {
        col: (index % mapSize) - mapRadius,
        row: (parseInt(index / mapSize)) - mapRadius
    };
}

