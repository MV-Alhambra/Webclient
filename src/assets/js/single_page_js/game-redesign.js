"use strict";


function toggle() {
    if (redesign.classList.contains("toggle-on")) {
        redesign.classList.remove("toggle-on");
        redesign.innerHTML = "<span>redesign off</span>";
    } else {
        redesign.classList.add("toggle-on");
        redesign.innerHTML = "<span>redesign on</span>";
    }
}