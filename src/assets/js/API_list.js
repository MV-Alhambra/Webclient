'use strict';

const root =  "http://172.21.22.52:48201/alhambra-21/api/"; // http://localhost:8080/;

function returnGames() {   // Show all games from your group lobby
    return fetchJSON(`${root}games`, 'GET');
}

function returnLobby(gameId) {
    return returnGames().then(response => response.find(lobby => lobby.id === gameId));
}

function addGame(customGameName, cap) {   // Add a new game in your lobby
    return fetchJSON(`${root}games`, 'POST', "", {customGameName: customGameName, maxNumberOfPlayers: cap});
}

function addPlayer(gameId, playerName) { //add player to your lobby, player name needs to be lowercase
    return fetchRaw(`${root}games/${gameId}/players`, 'POST', '', {playerName: playerName});
}

function getGame(gameId, token) { // Get the state of a game
    return fetchJSON(`${root}games/${gameId}`, 'GET', token);
}

function startGame(gameId, token) { // Get the state of a game
    return fetchRaw(`${root}games/${gameId}`, 'POST', token);
}

async function getGameStarted(gameId, token) {
    const game = await getGame(gameId, token);
    return game.readyCount === game.playerCount && parseInt(game.readyCount) > 1;
}

function setPlayerReady(gameId, token, playerName) {
    return fetchJSON(`${root}games/${gameId}/players/${playerName}/ready`, "PUT", token);
}

function setPlayerUnready(gameId, token, playerName) {
    return fetchJSON(`${root}games/${gameId}/players/${playerName}/ready`, "DELETE", token);
}

async function leaveGame(gameId, token, playerName) {
    return fetchJSON(`${root}games/${gameId}/players/${playerName}`, "DELETE", token);
}

function getGameProperty(gameId, token, property) {
    return getGame(gameId, token).then(response => {
        return response[property];
    });
}

function getPlayerCount(gameId, token) {
    return getGameProperty(gameId, token, 'playerCount');
}

function getLobbyName(gameId, token) {
    return getGameProperty(gameId, token, 'customNameLobby');
}

function getPlayerReady(gameId, token) {
    return getGameProperty(gameId, token, 'readyCount');
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
    return fetchRaw(`${root}games/${gameId}/players/${playerName}/money`, "POST", token, coins);
}

function buyBuilding(gameId, token, playerName, currency, coins) {
    return fetchRaw(`${root}games/${gameId}/players/${playerName}/buildings-in-hand`, "POST", token, {currency: currency, coins: coins});
}

function placeBuilding(gameId, token, playerName, building, location) {
    return fetchRaw(`${root}games/${gameId}/players/${playerName}/city`, "POST", token, {building: building, location: location});
}

function getBuildingTypes() {
    return fetchJSON(`${root}buildings/types`, "GET");
}

function getCurrencies() {
    return fetchJSON(`${root}currencies`, "GET");
}

function getCityLocations(gameId, playerName, walls) {
    return fetchJSON(`${root}games/${gameId}/players/${playerName}/city/locations?north=${walls.north}&east=${walls.east}&south=${walls.south}&west=${walls.west}`, "GET");
}

function redesignCityToReserve(gameId, token, playerName, location) {
    return fetchRaw(`${root}games/${gameId}/players/${playerName}/city`, "PATCH", token, {location: location});
}

function redesignReserveToCity(gameId, token, playerName, building, location) {
    return fetchRaw(`${root}games/${gameId}/players/${playerName}/city`, "PATCH", token, {building: building, location: location});
}



