"use strict";

let redesignOn = false;

function toggle() {
    if (redesign.classList.contains("toggle-on")) {
        redesign.classList.remove("toggle-on");
        redesign.innerHTML = "<span>redesign off</span>";
        redesignOn = false;
    } else {
        redesign.classList.add("toggle-on");
        redesign.innerHTML = "<span>redesign on</span>";
        redesignOn = true;
    }
    refresh();//remove or add addEventListeners for redesign
}