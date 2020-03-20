"use strict";

document.addEventListener('DOMContentLoaded', init);

function init() {
    document.querySelector('#buildingrulesbutton').addEventListener('click', togglebuildingrules);
    document.querySelector('#twoplayersrulesbutton').addEventListener('click', toggle2playerrules);
}

function togglebuildingrules(){
    const selected = document.querySelector('#buildingrulesbutton');
    const rules = document.querySelector('#buildingrules');
    if(selected.innerHTML === "▼"){
        selected.innerHTML = "►";
        rules.innerHTML = ``;
    }
    else{
        selected.innerHTML = "▼";
        rules.innerHTML = `<ul>
        <li>All building tiles must be <strong>the same way round</strong> as your starting tile (i.e. all roofs must point upwards).</li>
        <li><strong>Adjoining sides must be the same</strong> i.e. they must either both have a wall or both not have a wall.</li>
        <li>You must be able to reach each new building tile <strong>"on foot"</strong>
         from the starting tile without crossing a wall and without going off the tiles.</li>
        <li>Each new tile must be joined to your Alhambra by <strong>at least one side</strong> (i.e. it cannot be joined just at a corner).</li>
        <li>You must not leave <strong>any "spaces"</strong> (i.e. an empty area surrounded on all sides by building tiles).</li>
        </ul>`;
    }

}

function toggle2playerrules(){
    const selected = document.querySelector('#twoplayersrulesbutton');
    const rules = document.querySelector('#twoplayersrules');
    if(selected.innerHTML === "▼"){
        selected.innerHTML = "►";
        rules.innerHTML = ``;
    }
    else{
        selected.innerHTML = "▼";
        rules.innerHTML = `<p>The normal Alhambra rules apply with the following changes:</p>
    <ul>
        <li>The pack contains three of each money card; <strong>one of each is removed,</strong> i.e. only <strong>72 money cards are used.</strong></li>
        <li>There is an <strong>imaginary third player.</strong> Let's call him Dirk. Dirk does not build an Alhambra but <strong>does collect building tiles.</strong>
         Dirk does not have any turns.</li>
        <li><strong>At the beginning of the game 6 building tiles are drawn randomly from the bag</strong>
         and put to one side for Dirk - in full view of both players.</li>
        <li><strong>In the scoring rounds DIrk is awarded points for having the most of any of the different kinds of building</strong>
         but <strong>not</strong> for having an external wall.</li>
        <li><strong>Directly after the first scoring</strong> round Dirk is given 6 more tiles...</li>
        <li><strong>Dirk is given 6 more tiles </strong>which are also randomly drawn from the bag and placed with his others.</li>
        <li>After the <strong>2<sup>nd</sup> scoring round Dirk is given more building tiles.</strong>
         This time he is not necessarily given 6 but is instead given a <strong>third of the tiles remaining in the bag (rounded down)</strong>.</li>
        <li>Only one rule is different for the two players: whenever they buy a building tile they can not
         only add it to their Alhambra or place it on their reserve board; they can also give the building tile to Dirk.</li>
    </ul>`;
    }
}
