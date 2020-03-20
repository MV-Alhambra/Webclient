"use strict";

document.addEventListener('DOMContentLoaded', init);

function init(){
    document.querySelector('#pspopup').addEventListener('click', showpointsystem);
    document.querySelector('.close').addEventListener('click', closepointsystem);
}

function showpointsystem(){
    document.querySelector('.pointsystem').style.display = 'flex';
}

function closepointsystem(){
    document.querySelector('.pointsystem').style.display = 'none';
}

