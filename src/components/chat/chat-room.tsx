import { socket } from "../../api/socket";
import { useEffect, useState } from "react";
import type { IMessage } from "../../types/chat/message.types";

const ChatRoom = ({ currentRoomId }: { currentRoomId: string }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("receive_private_message", (data: IMessage) => {
      setMessages((prev) => [...prev, `${data.from}: ${data.message}`]);
    });

    socket.on("receive_private_notification", (data: IMessage) => {
      alert(`${data.from}\n${data.message}`);
    });

    socket.on("chat_history", (data: IMessage[]) => {
      const oldMessages = data.map((message) => {
        return `${message.from}: ${message.message}`;
      });
      setMessages(oldMessages);
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_private_message");
    };
  }, []);

  const sendPrivateMessage = () => {
    socket.emit("private_message", {
      toPrivateRoom: currentRoomId,
      message: message,
    });
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
