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
    }
}

function dragBuilding(e) {
    buildingDrag.style.top = (e.clientY) + "px";
    buildingDrag.style.left = (e.clientX) + "px";
    buildingDrag.classList.remove("hidden");
}

function dragBuildingStart(e) {
    buildingDrag.innerHTML = createBuilding(convertBuildingToObject(e.target));
    e.target.classList.add("draggedBuilding");

}

function dragBuildingEnd(e) {
    if (e.target.closest("#reserve")) {//do it if it finds the reserve
        console.log("found");
        const index = parseInt(buildingDrag.firstElementChild.getAttribute("data-index"));
        console.log(convertIndexToStaticLocation(index));
    } else {
        console.log("not found");
        buildingDrag.classList.add("hidden");
        setMap();
    }
}

function convertIndexToStaticLocation(index) {
    return {
        col: index % mapSize,
        row: parseInt(index / mapSize)
    }
}

