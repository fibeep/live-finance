# Tik-Tak-Io
------------------
# Description:
> This project makes use of Socket.io in order to implement websocket technology
> 2 Players can join a game of tik-tak-toe and interact in real time over the use of websockets

By using websockets, it allows both players to interact simultanously over the web.
This allows the players (and the game logic) to perform the following actions in real time:
> - Create / Join a game
> - Place an X or O depending on the player
> - Determine whether it is a player's turn
> - Determine when a player wins

## Install Guide
> 1) Clone the repo by running the following command in the terminal:
> `$ git clone https://github.com/fibeep/tik-tac-io.git`
> 2) To install all dependencies run:
> `$ npm install`
> if this command does not run, ensure you have [_Node.js and npm_](https://phoenixnap.com/kb/install-node-js-npm-on-windows)  installed on your computer
> 3) Run `$ node app.js` on your terminal
> 4) Open 2 browsers and head to your localhost:3000
> 5) Insert the ID for the game in both browsers, and play!

## To run with Docker:
> In the terminal run the command `docker build -t dockerio`
> Then run the command `docker run -it -p 9000:3000 dockerio`
> In your browser, access the site by navigating to localhost:9000

## Technical Details:
**Written Node.js**
**Makes use of:**
- *Socket.io*
- *Express*
- *Docker*


##### Sidenote
The diagram can be found in the file named 'diagram.png'