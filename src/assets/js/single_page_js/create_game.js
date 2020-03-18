'use script';

document.addEventListener('DOMContentLoaded',init);

let gameId = 'e';

function init(){
    document.querySelector('form').addEventListener('submit',createGame)
}

function createGame(e) {
    e.preventDefault();

    if (gameId){
        console.log('yeah')
    }else{
        console.log('No')
    }



}
