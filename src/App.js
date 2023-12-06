import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:9000'); // Connect to your server

const BoardRenderer = ({ room, pickedColor }) => {
  const [board, setBoard] = useState([
    ["#000000", "#000000", "#000000"],
    ["#000000", "#FFFFFF", "#000000"],
    ["#000000", "#000000", "#000000"],
  ]);

  useEffect(() => {
    socket.on("render_board", (board) => {
      setBoard(board);
    });
  }, [socket]);

  const putPiece = (x, y) => {
    console.log(`${socket.id} hit ${x}, ${y} to room ${room}`);
    socket.emit("put_piece", {
      x: x,
      y: y,
      color: pickedColor,
      player: socket.id,
      room: room
    });
  };

  if (!board) {
    board = [[]];
  }

  return (
    <div>
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
              onClick={() => putPiece(rowIndex, cellIndex)}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

const ColorPicker = ({ pickedColor, setPickedColor }) => {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  return (
    <div style={{ display: 'flex' }}>
      {colors.map((color, index) => (
        <div 
          key={index}               
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: color,
            border: `${(pickedColor === color)? 3 : 0}px solid #000000`,
            margin: '2px',
          }}
          onClick={() => {setPickedColor(color)}}
        />
      ))}
    </div>
  );
};

function App() {
  const [room, setRoom] = useState('room1');
  const [position, setPosition] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [gameMsg, setGameMsg] = useState('');
  const [pickedColor, setPickedColor] = useState('#FF0000');

  useEffect(() => {
    socket.on("error_message", (msg) => {
      setErrorMsg(msg);
    });

    socket.on("message", (msg) => {
      setGameMsg(msg);
    });
  }, [socket]);

  const joinRoom = () => {
    if (!room) {
      alert("Invalid room name.");
    }
    socket.emit('join_room', room);
  };

  return (
    <div>
      <h1>Socket.io React App</h1>
      <div>
        <h3>Player ID</h3>
        <span>{socket.id}</span>
      </div>
      <div>
        <h3>Error</h3>
        <span>{errorMsg}</span>
      </div>
      <div>
        <h3>Msg</h3>
        <span>{gameMsg}</span>
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
        <h2>Game</h2>
        <BoardRenderer room={room} pickedColor={pickedColor}/>
      </div>
      <div>
        <h2>Color Picker</h2>
        <ColorPicker pickedColor={pickedColor} setPickedColor={setPickedColor}/>
      </div>
    </div>
  );
}

export default App;
