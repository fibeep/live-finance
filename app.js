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

    socket.on('getGame', (gameId) => {
        fs.readFile(gameId+'.json', (err, data) => {
            if (err) throw err;
            let game = JSON.parse(data);
            io.emit('gameUpdate', game);

        });

        
      });
    

    socket.on('joinGame', (gameId) => {
        console.log('User joining game', gameId);
        const game = {boxes : [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,]}
        let data = JSON.stringify(game);
        fs.writeFileSync(gameId+'.json', data);
        io.emit('ready');
        fs.watchFile("./"+gameId+'.json', (curr, prev) => {
            io.emit('ready');
    
        });
        

        
      });
      socket.on('makeMove', (data) => {
        console.log('User made a move', data);
        fs.readFile(data.gameId+'.json', (err, game) => {
            if (err) throw err;
            game = JSON.parse(game);
            if(!game.boxes[data.moveLocation]){
                game.boxes[data.moveLocation] = data.moveType
                let newData = JSON.stringify(game);
                fs.writeFileSync(data.gameId+'.json', newData);
    
                
            }

        });
        //EMIT EVENT THAT YOU CANNOT MOVE THERE
        
        
        });
   
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });