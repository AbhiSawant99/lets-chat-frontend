import { socket } from "../../api/socket";
import { useEffect, useState } from "react";

const ChatRoom = ({ chatUserId }: { chatUserId: string }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive_private_message", (data) => {
      console.log("data - ", data);
      setMessages((prev) => [...prev, `${data.from}: ${data.message}`]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_private_message");
    };
  }, []);

  const sendPrivateMessage = () => {
    socket.emit("private_message", { toUserId: chatUserId, message: message });
    setMessage("");
  };

  return (
    <div>
      <h2>Socket.IO Chat</h2>
      {/* <input
        placeholder="Your name"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input placeholder="Room" onChange={(e) => setRoom(e.target.value)} />
      <button onClick={joinRoom}>Join Room</button> */}

      <div>
        <input
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendPrivateMessage}>Send Message</button>
      </div>

      <div>
        <h3>Messages:</h3>
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>
    </div>
  );
};

export default ChatRoom;
