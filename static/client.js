var socket = io();

console.log("Hola")

function joinGame(gameId){
    socket.emit('joinGame',gameId)

}



function makeMove(moveLocation){
    var gameId = document.getElementById('gameId').value
    var moveType
    if(document.getElementById('xType').checked){
        moveType = "X"
    }else{
        moveType = "O"
    }
    console.log("Making a move",{gameId, moveType, moveLocation})
    socket.emit('makeMove',{gameId, moveType, moveLocation})

}

socket.on('gameUpdate',(data) => {
    console.log("There is a game update", data)
    for(var i=0;i< data.boxes.length;i++){
        if(data.boxes[i]){
            document.getElementById(i.toString()).innerText = data.boxes[i]
        }
    }
});


socket.on('ready',()=>{
    socket.emit('getGame',document.getElementById('gameId').value)
})
socket.on('Illegal',()=>{
    alert("You cannot move there")
})
socket.on('NotTurn',()=>{
    alert("Its not your turn")
})