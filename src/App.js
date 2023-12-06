import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:9000'); // Connect to your server

const BoardRenderer = ({ board }) => {
  if (!board) {
    board = [[]];
  }

  return (
    <div>
      <h2>Game</h2>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((color, cellIndex) => (
            <div
              key={cellIndex}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: color,
                border: '1px solid #000000',
                margin: '2px',
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

function App() {
  const [room, setRoom] = useState('');
  const [position, setPosition] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [gameMsg, setGameMsg] = useState('');
  const [board, setBoard] = useState([
    ["#000000", "#000000", "#000000"],
    ["#000000", "#FFFFFF", "#000000"],
    ["#000000", "#000000", "#000000"],
  ]);

  useEffect(() => {
    socket.on("error_message", (msg) => {
      setErrorMsg(msg);
    });

    socket.on("message", (msg) => {
      setGameMsg(msg);
    });

    socket.on("render_board", (board) => {
      setBoard(board);
    });
  }, [socket]);

  const joinRoom = () => {
    if (!room) {
      alert("Invalid room name.");
    }
    socket.emit('join_room', room);
  };

  const putPiece = () => {
    position.split(',');
    const [xStr, yStr] = position.split(",");

    // Convert x and y to integers
    const x = parseInt(xStr, 10);
    const y = parseInt(yStr, 10);

    // Check if the conversion was successful
    if (isNaN(x) || isNaN(y)) {
      alert("Invalid input for x or y");
    }

    socket.emit("put_piece", {
      x: x,
      y: y,
      player: socket.id,
      room: room
    });
  }

  return (
    <div>
      <h1>Socket.io React App</h1>
      <div>
        <h3>Player ID</h3>
        <h>{socket.id}</h>
      </div>
      <div>
        <h3>Error</h3>
        <h>{errorMsg}</h>
      </div>
      <div>
        <h3>Msg</h3>
        <h>{gameMsg}</h>
      </div>
      <div>
        <h2>Room</h2>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join</button>
      </div>
      <div>
        <h2>Put Piece</h2>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <button onClick={putPiece}>Put</button>
      </div>
      <div>
        <BoardRenderer board={board}/>
      </div>
    </div>
  );
}

export default App;
