const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');
const { type } = require('os');

app.use(express.static('static'))

var games = {}

server.listen(3000, () => {
  console.log('listening on *:3000');
});

function checkIfSame(range, board, moveType){
  //range = [1,2,3]
  //board = [x,x,x,x,x,x,x,x,x]
  //type = 'x'

  var first= board[range[0]] == moveType
  var second = board[range[1]] == moveType
  var third = board[range[2]] == moveType



  return (first && second && third)
}

function checkIfWon(board, moveType){
  //Board is [x,x,x,x,x,x,x,x,x]
  /*
  [x,x,x,]
  */
  var topRow = checkIfSame([0,1,2], board, moveType)
  var midRow = checkIfSame([3,4,5], board, moveType)
  var botRow = checkIfSame([6,7,8], board, moveType)
  var firstCol = checkIfSame([0,3,6], board, moveType)
  var secCol = checkIfSame([1,4,7], board, moveType)
  var thiCol = checkIfSame([2,5,8], board, moveType)
  var dia1 = checkIfSame([0,4,8], board, moveType)
  var dia2 = checkIfSame([6,4,2], board, moveType)

  return topRow || midRow || botRow || firstCol || secCol || thiCol || dia1 || dia2




}

io.on('connection', (socket) => {
    function repeatChecking(gameId, oldValue) { 
      var temp1 = []
                    for(var i =0;i<games[gameId].boxes.length;i++){
                      temp1.push(games[gameId].boxes[i])
                    }
      oldValue=temp1 
        if(oldValue) {    
            setInterval(() => {     
                if(games[gameId].boxes !== oldValue) {  
                    console.log("GAME HAS BEEN UPDATED",games[gameId].boxes)    
                    io.emit('gameUpdate', games[gameId]);  
                    var temp = []
                    for(var i =0;i<games[gameId].boxes.length;i++){
                        temp.push(games[gameId].boxes[i])
                    }
                    oldValue=temp

                }else{
                    console.log("No update",games[gameId].boxes == oldValue, games[gameId].boxes , oldValue)
                }    
            }, 3000);  
        }}
    console.log('a user connected');

    socket.on('getGame', (gameId) => {
        io.emit('gameUpdate', games[gameId]);   
      });
    

    socket.on('joinGame', (gameId) => {
        console.log('User joining game', gameId);
        if(!games[gameId]){
          games[gameId] = {boxes : [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,]}        

        }
        var thisGame = games[gameId].boxes
        repeatChecking(gameId, thisGame)

        

        
      });
      socket.on('makeMove', (data) => {
        console.log('User made a move', data);
        if(data.gameId && games[data.gameId]){
          if(!games[data.gameId].boxes[data.moveLocation]){
              if(games[data.gameId].lastMove != data.moveType){
                games[data.gameId].boxes[data.moveLocation] = data.moveType
                games[data.gameId].lastMove = data.moveType
              }else{
                socket.emit('NotTurn')

              }
            

            console.log("Should have been updated")
        }else{
          socket.emit('Illegal')
        }
        }
            
    
        //EMIT EVENT THAT YOU CANNOT MOVE THERE    
        });
   
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });