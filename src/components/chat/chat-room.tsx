import { socket } from "../../api/socket";
import { useEffect, useRef, useState } from "react";
import type { IMessage } from "../../types/chat/message.types";
import {
  Avatar,
  Box,
  Button,
  Card,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import "./styles.css";
import type { IChat } from "../../types/chat/chat.types";
import SendIcon from "@mui/icons-material/Send";
import ChatMessage from "./chat-message";
import { useAppContext } from "../app-provider/app-context";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const ChatRoom = ({
  currentRoomId,
  currentChat,
}: {
  currentRoomId: string;
  currentChat: IChat;
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [typing, setTyping] = useState<string[]>([]);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAppContext();
  let typingTimeout: ReturnType<typeof setTimeout>;

  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    if (typing.length > 0) {
      setShowTyping(true);
    } else {
      // Give the exit animation time to finish (e.g., 300ms)
      const timeout = setTimeout(() => setShowTyping(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [typing]);

  useEffect(() => {
    socket.on("receive_private_message", (data: IMessage) => {
      setMessages((prev) => [...prev, data]);

      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 500);
    });

    socket.on("receive_private_notification", (data: IMessage) => {
      alert(`${data.from}\n${data.message}`);
    });

    socket.on("chat_history", (data: IMessage[]) => {
      setMessages(data);
      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 500);
    });

    socket.on("typing", (username: string) => {
      setTyping((prev) => {
        if (prev.includes(username)) return prev;
        return [...prev, username];
      });
    });

    socket.on("stopTyping", (username: string) => {
      setTyping((prev) => prev.filter((u) => u !== username));
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_private_message");
      socket.off("chat_history");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  const sendPrivateMessage = () => {
    socket.emit("private_message", {
      toPrivateRoom: currentRoomId,
      message: message,
    });
    setMessage("");
  };

  const messageChangeHandle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    socket.emit("typing", {
      roomId: currentRoomId,
      username: user?.displayName,
    });
    setMessage(e.target.value);

    if (typingTimeout) clearTimeout(typingTimeout);

    // start a new timer — if no key pressed for 1.5 sec → send "stopTyping"
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", {
        roomId: currentRoomId,
        username: user?.displayName,
      });
    }, 1500);
  };

  return (
    <Card
      className="chat-room-card"
      sx={{ width: { xs: "100%", md: "  70%" } }}
    >
      <Box className="chat-room-header">
        {currentChat.username ? (
          <Avatar
            alt={currentChat.username}
            src="/broken-image.jpg"
            sx={{ width: "3.125rem", height: "3.125rem" }}
          >
            <PersonRoundedIcon sx={{ fontSize: "1.75rem" }} />
          </Avatar>
        ) : null}
        <Typography variant="h6">
          {currentChat.username
            ? `${currentChat.username} ${currentChat.userId === user?.id ? "(You)" : ""}`
            : "Select Chat"}
        </Typography>
      </Box>
      <Box ref={chatBoxRef} id="chatBox" className="chat-box custom-scroll">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </Box>

      <div className="chat-bottom">
        {showTyping ? (
          <Typography
            variant="caption"
            className={`typing-text ${typing.length > 0 ? "" : "typing-exit"}`}
          >
            {typing.join(" ")} typing...
          </Typography>
        ) : null}
        <div className="chat-room-action">
          <TextField
            name="messageInput"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => messageChangeHandle(e)}
            className="chat-input"
            multiline
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={sendPrivateMessage}
                      variant="contained"
                      sx={{ borderRadius: "2rem" }}
                      disableElevation
                      disabled={!message}
                      className="message-sent"
                    >
                      <SendIcon />
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "0 0 1rem 1rem",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
            }}
          />

          {/* <Button
            onClick={sendPrivateMessage}
            variant="contained"
            sx={{ borderRadius: "1rem" }}
            disableElevation
          >
            <SendIcon />
          </Button> */}
        </div>
      </div>
    </Card>
  );
};

export default ChatRoom;
