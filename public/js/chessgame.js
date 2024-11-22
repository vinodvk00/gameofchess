const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let scourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add("square", 
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );

            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if(square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece",
                    square.color === 'w' ? "white" : "black"
                );

                pieceElement.innerHTML = getPieceUnicode(square); // get through unicode

                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", (e) => {
                    if(pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        scourceSquare = {
                            row: rowIndex,
                            col: squareIndex
                        }
                        e.dataTransfer.setData("text/plain", ""); // prevent drag and drop from not working
                    }
                });

                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    scourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", (e) => e.preventDefault());

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();

                if(draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row, 10),
                        col: parseInt(squareElement.dataset.col, 10),
                    };

                    handleMove(scourceSquare, targetSquare);
                }
            });

            boardElement.appendChild(squareElement);
            console.log(squareElement);
        });

    });

    if(playerRole === 'b') {
        boardElement.classList.add("flipped");
    } else {
        boardElement.classList.remove("flipped");
    }

};

// const handleMove = (source, target) => {
//     const move = {
//         from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
//         to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
//         promotion: "q",
//     };

//     socket.emit("move", move);
// };

const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: "q", // Assume pawn promotion to queen for simplicity
    };

    // Validate and apply the move locally
    const result = chess.move(move);

    if (result) {
        // Broadcast valid move to the server
        socket.emit("move", move);
        renderBoard();
    } else {
        console.log("Invalid move:", move);
    }
};


const getPieceUnicode = (piece)=> {
    const unicodePieces = {
        p: "♙",
        r: "♜",
        n: "♞",
        b: "♝",
        q: "♛",
        k: "♚",
        P: "♙",
        R: "♖",
        N: "♘",
        B: "♗",
        Q: "♕",
        K: "♔",
    };

    return unicodePieces[piece.type] || "";

    // const unicode = {
    //     k: {
    //         w: "&#9812",
    //         b: "&#9818"
    //     },
    //     q: {
    //         w: "&#9813",
    //         b: "&#9819"
    //     },
    //     r: {
    //         w: "&#9814",
    //         b: "&#9820"
    //     },
    //     b: {
    //         w: "&#9815",
    //         b: "&#9821"
    //     },
    //     n: {
    //         w: "&#9816",
    //         b: "&#9822"
    //     },
    //     p: {
    //         w: "&#9817",
    //         b: "&#9823"
    //     }
    // };

    // return unicode[piece.type][piece.color] || "";
};

socket.on("playerRole", (role) => {
    playerRole = role;
    // mention the player role through alert
    alert(`You are playing as ${playerRole === 'w' ? "white" : "black"}`);
    renderBoard();
});

socket.on("spectator", () => {
    // mention you are a spectator
    alert("You are a spectator");
    playerRole = null;
    renderBoard();
});

socket.on("boardState", (fen) => {
    chess.load(fen);
    renderBoard();
});

socket.on("move", (move) => {
    chess.move(move);
    renderBoard();
});

renderBoard();