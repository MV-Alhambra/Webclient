"use strict";


/* DISCLAIMER */
/*
* This file aims to help you get started. It demonstrates how to connect to the server
* Feel free to extend the config with other variables of your choice
*
* Naturally, you don't need to include all JS code in this file. Create a decent folder structure to organise your JS logic
* */


document.addEventListener('DOMContentLoaded',init);

function init(){
    testRemoteAPI();
}

function testRemoteAPI(){


    // Show all games from your group lobby
    fetchFromServer(`${config.root}games?details=true&prefix=group${config.groupnumber}`,'GET').then(function(response){
        // These are the games in your group lobby, the first time you'll call this, this will be an empty array
        console.log(response);
    });

    // Add a new game in your lobby
    fetchFromServer(`${config.root}games`,'POST',{prefix: `group${config.groupnumber}` }).then(function(response){
        // The reply here is the game ID, keep it secret, keep it safe!
        console.log(response);
    });

    // Get the request again. Note: this may show up in a different order in the console window
    fetchFromServer(`${config.root}games?details=true&prefix=group${config.groupnumber}`,'GET').then(function(response){
        // These are the games in your group lobby, the first time you'll call this, this will be an empty array
        console.log(response);
    });

}
