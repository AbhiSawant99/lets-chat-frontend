import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import "./styles.css";
import SendIcon from "@mui/icons-material/Send";
import ChatMessage from "./chat-message";
import type { IChat } from "@/types/chat/chat.types";
import type { IMessage } from "@/types/chat/message.types";
import { useAppContext } from "@/components/app-provider/app-context";
import { socket } from "@/api/socket.api";
import getImageUrl from "@/api/image-url.api";

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
    socket.on("receive_private_message", (message: IMessage) => {
      setMessages((prev) => [...prev, message]);

      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 500);

      socket.emit("mark_message_seen", {
        toPrivateRoom: currentRoomId,
        message: message,
      });
    });

    socket.on("message_seen", (message: IMessage) => {
      setMessages((prev) =>
        prev.map((oldmessage) =>
          oldmessage.id === message.id ? { ...message } : oldmessage
        )
      );
    });

    socket.on("chat_history", (message: IMessage[]) => {
      setMessages(message);
      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 500);

      socket.emit("mark_history_message_seen", {
        toPrivateRoom: currentRoomId,
      });
    });

    socket.on("history_message_seen", (messages: IMessage[]) => {
      setMessages((prev) =>
        prev.map((oldMessage) => {
          const messageToReplace = messages.find(
            (message) => message.id === oldMessage.id
          );
          if (messageToReplace) {
            return messageToReplace;
          } else {
            return oldMessage;
          }
        })
      );
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
      socket.off("receive_private_message");
      socket.off("chat_history");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  const sendPrivateMessage = () => {
    socket.emit("private_message", {
      toPrivateRoom: currentRoomId,
      message: message.trim(),
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

  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (message.length < 1) return;

    sendPrivateMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      if (message.trim()) {
        sendPrivateMessage();
      }
    }
  };

  return (
    <Card
      className="chat-room-card"
      sx={{ width: { xs: "100%", md: "  70%" } }}
    >
      <Box className="chat-room-header">
        {currentChat.username ? (
          <Badge
            overlap="circular"
            variant="dot"
            color="success"
            invisible={!currentChat.online}
          >
            <Avatar
              alt={currentChat.username}
              src={`${getImageUrl(currentChat.photo)}`}
              sx={{ width: "3.125rem", height: "3.125rem" }}
              slotProps={{
                img: {
                  loading: "lazy",
                },
              }}
            />
          </Badge>
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
        <form className="chat-room-action" onSubmit={handleMessageSubmit}>
          <TextField
            name="messageInput"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => messageChangeHandle(e)}
            className="chat-input"
            multiline
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={sendPrivateMessage}
                      variant="text"
                      sx={{ borderRadius: "2rem" }}
                      disableElevation
                      disabled={!message.trim()}
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
        </form>
      </div>
    </Card>
  );
};

export default ChatRoom;
