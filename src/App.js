import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:9000'); // Connect to your server

function App() {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    // Send a message to the server
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div>
      <h1>Socket.io React App</h1>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
