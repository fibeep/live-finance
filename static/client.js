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
    console.log(data)
    if(data.gameId ==document.getElementById('gameId').value){
        console.log("There is a game update", data)
        for(var i=0;i< data.game.boxes.length;i++){
            if(data.game.boxes[i]){
                document.getElementById(i.toString()).innerText = data.game.boxes[i]
            }else{
                document.getElementById(i.toString()).innerText = '‏‏‎ ‎'
            }
        }
    }
   
});



socket.on('Illegal',()=>{
    alert("You cannot move there")
})
socket.on('NotTurn',()=>{
    alert("Its not your turn")
})
socket.on('Win',()=>{
    alert("Congrats you won!")
    location.reload()
})

socket.on('Lost',()=>{
    alert("Sorry you lost")
    location.reload()

})