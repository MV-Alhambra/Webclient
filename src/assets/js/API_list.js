'use strict';

function returnGames() {   // Show all games from your group lobby
    return fetchJSON(`${config.root}games?details=true&prefix=group${config.groupnumber}`, 'GET');
}

function addGame() {   // Add a new game in your lobby
    return fetchJSON(`${config.root}games`, 'POST', '', {prefix: `group${config.groupnumber}`});
}

function addPlayer(gameId, playerName) { //add player to your lobby, player name needs to be lowercase
    return fetchRaw(`${config.root}games/${gameId}/players`, 'POST', '', {playerName: playerName});
}

function getGame(gameId, token) { // Get the state of a game
    return fetchJSON(`${config.root}games/${gameId}`, 'GET', token);
}

function setPlayerReady(gameId, token, playerName) {
    return fetchJSON(`${config.root}games/${gameId}/players/${playerName}/ready`, "PUT", token);
}

function setPlayerUnready(gameId, token, playerName) {
    return fetchJSON(`${config.root}games/${gameId}/players/${playerName}/ready`, "DELETE", token);
}

async function leaveGame(gameId, token, playerName) {
    return fetchJSON(`${config.root}games/${gameId}/players/${playerName}`, "DELETE", token);
}

function getGameProperty(gameId, token, property) {
    return getGame(gameId, token).then(response => {
        return response[property];
    });
}

function getPlayerCount(gameId, token) {
    return getGameProperty(gameId, token, 'playerCount');
}

function getPlayerReady(gameId, token) {
    return getGameProperty(gameId, token, 'readyCount');
}

function getGameStarted(gameId, token) {
    return getGameProperty(gameId, token, 'started');
}

function getGamePlayers(gameId, token) {
    return getGameProperty(gameId, token, 'players');
}

function getGameCurrentPlayer(gameId, token) {
    return getGameProperty(gameId, token, 'currentPlayer');
}

function getGamePlayer(gameId, token, playerName) { //returns the specific player object which has that name as value
    return getGamePlayers(gameId, token).then(players => {
        return players.find(player => player.name === playerName);
    });
}

function getGamePlayerProperty(gameId, token, playerName, property) {
    return getGamePlayer(gameId, token, playerName).then(player => player[property]);
}

function takeCoins(gameId, token, playerName, coins) {
    return fetchRaw(`${config.root}games/${gameId}/players/${playerName}/money`, "POST", token, coins);
}

function buyBuilding(gameId, token, playerName, currency, coins) {
    return fetchRaw(`${config.root}games/${gameId}/players/${playerName}/buildings-in-hand`, "POST", token, {currency: currency, coins: coins});
}

function placeBuilding(gameId, token, playerName, building, location) {
    return fetchRaw(`${config.root}games/${gameId}/players/${playerName}/city`, "POST", token, {building: building, location: location});
}

function getBuildingTypes() {
    return fetchJSON(`${config.root}buildings/types`, "GET");
}

function getCurrencies() {
    return fetchJSON(`${config.root}currencies`, "GET");
}

function getCityLocations(gameId, playerName, walls) {
    return fetchJSON(`${config.root}games/${gameId}/players/${playerName}/city/locations?north=${walls.north}&east=${walls.east}&south=${walls.south}&west=${walls.west}`,"GET");
}

