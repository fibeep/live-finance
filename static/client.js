var socket = io();

console.log("Hola")

function joinGame(gameId){
    socket.emit('joinGame',gameId)

}
