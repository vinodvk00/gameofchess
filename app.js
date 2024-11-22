const express = require('express');
const socket = require('socket.io');
const http = require('http');
const {Chess} = require('chess.js');
const path = require('path');

const app = express();

const server = http.createServer(app);
const io = socket(server);


const chess = new Chess(); // chess engine

let players = {};
let currentPlayer = "W";

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {title: "Welcome to Chess"});
});

io.on("connection", function(uniquesocket) {
    console.log("connected");

    if(!players.white) {
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w");
    } else if(!players.black) {
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    } else {
        uniquesocket.emit("spectator");
    }

    uniquesocket.on("disconnect", function() {
        if(socket.id === players.white) {
            delete players.white;
        } else if(socket.id === players.black) {
            delete players.black;
        }
    })

    uniquesocket.on("move", (move)=> {
        try{
            if(chess.turn() === 'w' && uniquesocket.id !== players.white) {
                return;
            }

            if(chess.turn() === 'b' && uniquesocket.id !== players.black) {
                return;
            }

            const result = chess.move(move); // chess.js move function returns null if move is invalid

            if(result) {
                currentPlayer = chess.turn();
                io.emit("move", move);
                io.emit("boardState", chess.fen());
            } else {
                console.log("Invalid move : ", move);
                uniquesocket.emit("invalidMove", move);
            }

        } catch(err) {
            console.log(err);
            console.log("Invalid move : ", move);
        }
        
    });
});

server.listen(3000, function() {
    console.log('Server started on port 3000');
});
    

