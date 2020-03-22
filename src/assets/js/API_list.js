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
    return fetchFromServerWithReturnErrorAndJson(`${config.root}games/${gameId}/players`, 'POST', {playerName: playerName}).then(function (response) {
        return response;
    });
}

function getGame(gameId, token) { // Get the state of a game
    return fetchWithToken(`${config.root}games/${gameId}`, 'GET', token).then(response => response);
}

function getGameProperty(gameId, token, property) {
    return getGame(gameId, token).then(response => {
        return response[property];
    });
}

function setPlayerReady(gameId, token, playerName) {
   return  fetchWithToken(`${config.root}games/${gameId}/players/${playerName}/ready`, "PUT", token);
}

function setPlayerUnready(gameId, token, playerName) {
    return fetchWithToken(`${config.root}games/${gameId}/players/${playerName}/ready`, "DELETE", token);
}

async function leaveGame(gameId, token, playerName) {
    return fetchWithToken(`${config.root}games/${gameId}/players/${playerName}`, "DELETE", token);
}

async function getPlayerCount(gameId, token) {
    return getGameProperty(gameId, token, 'playerCount');
}

async function getPlayerReady(gameId, token) {
    return getGameProperty(gameId, token, 'readyCount');
}

async function getGameStarted(gameId, token) {
    return getGameProperty(gameId, token, 'started');
}

async function getGamePlayers(gameId, token) {
    return getGameProperty(gameId, token, 'players');
}

async function getGameCurrentPlayer(gameId, token) {
    return  getGameProperty(gameId, token, 'currentPlayer');
}

