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
        document.querySelectorAll("#map .building").forEach(building => building.addEventListener("drag", dragBuilding));
        document.querySelectorAll("#map .building").forEach(building => building.addEventListener("dragstart", dragBuildingStart));
        document.querySelectorAll("#map .building").forEach(building => building.addEventListener("dragend", dragBuildingEnd));
        reserveWrapper.parentElement.addEventListener("drop", dragBuildingDrop); // this triggers when an item gets dropped in it
        reserveWrapper.parentElement.addEventListener("dragover", ev => ev.preventDefault());//this sets the location where i can drop the item
    }
}

function dragBuilding(e) {
    buildingDrag.style.top = (e.clientY) + "px";
    buildingDrag.style.left = (e.clientX) + "px";

}

function dragBuildingStart(e) {
    buildingDrag.innerHTML = e.target.outerHTML;
    e.target.classList.add("draggedBuilding");
    buildingDrag.style.top = (e.clientY) + "px";
    buildingDrag.style.left = (e.clientX) + "px";
    buildingDrag.classList.remove("hidden");
}

function dragBuildingEnd() {
    buildingDrag.classList.add("hidden");
    setMap();
}

function dragBuildingDrop(e) {
    const index = parseInt(buildingDrag.firstElementChild.getAttribute("data-index"));
    setCityBuildingToReserve(gameId,token,playerName,convertIndexToLocation(index)).then(response=>responseHandler(response,e));
}

function convertIndexToStaticLocation(index) {
    return {
        col: index % mapSize,
        row: parseInt(index / mapSize)
    }
}

function convertStaticToDynamicLocation(staticLocation) {
    const mapRadius = (mapSize - 1) / 2;
    return {
        row: staticLocation.row - mapRadius,
        col: staticLocation.col - mapRadius
    }
}

function convertIndexToLocation(index) {
    const mapRadius = (mapSize - 1) / 2;
    return {
        col: (index % mapSize) - mapRadius,
        row: (parseInt(index / mapSize)) - mapRadius
    }
}

