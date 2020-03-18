'use strict';

function returnGames() {   // Show all games from your group lobby
    return fetchFromServer(`${config.root}games?details=true&prefix=group${config.groupnumber}`, 'GET').then(function (response) {
        return response;  // These are the games in your group lobby, the first time you'll call this, this will be an empty array
    });
}

function addGame() {   // Add a new game in your lobby
    return fetchFromServer(`${config.root}games`, 'POST', {prefix: `group${config.groupnumber}`}).then(function (response) {
        return response; // The reply here is the game ID, keep it secret, keep it safe!
    });
}

function addPlayer(gameId, playerName) { //add player to your lobby, player name needs to be lowercase
    return fetchFromServer(`${config.root}games/${gameId}/players`, 'POST', {playerName: `${playerName}`}).then(function (response) {
        return response;
    })
}
