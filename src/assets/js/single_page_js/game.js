"use strict";

document.addEventListener('DOMContentLoaded', init);

function init(){
    document.querySelector('#pspopup').addEventListener('click', showpointsystem);
}

function showpointsystem(){
    document.querySelector('.pointsystem').style.display = 'flex';
}

