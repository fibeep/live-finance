const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');

app.use(express.static('static'))

var games = {}

server.listen(3000, () => {
  console.log('listening on *:3000');
});



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