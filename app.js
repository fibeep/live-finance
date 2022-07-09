const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');

app.use(express.static('static'))

const gamesFile = './games.json';


server.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinGame', (gameId) => {
        console.log('User joining game', gameId);
        const game = {boxes : []}
        let data = JSON.stringify(game);
        fs.writeFileSync(gameId+'.json', data);
       
        fs.watchFile("./"+gameId+'.json', (curr, prev) => {
            let jsonData = require('./games/gameId.json');
            console.log(jsonData);
            io.emit('gameUpdate', 
                jsonData);
        });
        
      });
      socket.on('makeMove', (gameId, moveLocation, moveType) => {
        console.log('User made a move');

        });
   
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });