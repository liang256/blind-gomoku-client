const io = require("socket.io-client");

const socket = io.connect("http://localhost:9000");

function App() {
  const sendMessage = () => {
    console.log("send message!")
  };
  return (
    <div className="App">
      <input placeholder='message'></input>
      <button onClick={sendMessage}>submit</button>
    </div>
  );
}

export default App;
