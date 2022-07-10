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
  var thisPersonMove
    function repeatChecking(gameId, oldValue) { 
      var temp1 = []
      for(var i =0;i<games[gameId].boxes.length;i++){
        temp1.push(games[gameId].boxes[i])
      }
      oldValue=temp1 
        if(oldValue) {    
          var myInterval = setInterval(() => {    
            if(games[gameId]){
              if(games[gameId].over == true && thisPersonMove != games[gameId].lastMove){
                console.log("THEY LOST")

                socket.emit('gameUpdate', { game :games[gameId],gameId}); 
                socket.emit('Lost');  

                delete games[gameId]
                clearInterval(myInterval)



              }else{
                if(games[gameId] && games[gameId].boxes !== oldValue) {  
                  var temp = []
                  var gameOver = true
                  for(var i =0;i<games[gameId].boxes.length;i++){
                      temp.push(games[gameId].boxes[i])
                      if(games[gameId].boxes[i]){
                        gameOver = false
                      }
                  }
                  oldValue=temp
                  io.emit('gameUpdate', {game :games[gameId], gameId : gameId});  

          

              }   
            }
              
              }else{
                clearInterval(myInterval)
              }
                
            }, 1000);  
        }}
    console.log('a user connected');

    socket.on('getGame', (gameId) => {
        socket.emit('gameUpdate', {game: games[gameId], gameId : gameId});   
      });
    

    socket.on('joinGame', (gameId) => {
        console.log('User joining game', gameId);
        
        games[gameId] = {boxes : [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,]}        

        
        var thisGame = games[gameId].boxes
        repeatChecking(gameId, thisGame, true)

        

        
      });
      socket.on('makeMove', (data) => {
        console.log('User made a move', data);
        if(data.gameId && games[data.gameId]){
          if(!games[data.gameId].boxes[data.moveLocation]){
              if(games[data.gameId].lastMove != data.moveType){
                games[data.gameId].boxes[data.moveLocation] = data.moveType
                games[data.gameId].lastMove = data.moveType
                thisPersonMove = data.moveType

                if(checkIfWon(games[data.gameId].boxes,data.moveType)){
                  socket.emit('gameUpdate', {game: games[data.gameId], gameId: data.gameId});   
                  socket.emit('Win')
                  games[data.gameId].over = true
                  

                }
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