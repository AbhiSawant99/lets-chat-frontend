import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useColorScheme,
} from "@mui/material";
import "./styles.css";
import SendIcon from "@mui/icons-material/Send";
import ChatMessage from "./chat-message";
import type { IChat } from "@/types/chat/chat.types";
import type { IMessage } from "@/types/chat/message.types";
import { useAppContext } from "@/components/app-provider/app-context";
import { socket } from "@/api/socket.api";
import getImageUrl from "@/api/image-url.api";
import { groupMessagesByDate } from "@/utils/groupMessage";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";

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
  const [showTyping, setShowTyping] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAppContext();
  const { mode } = useColorScheme();

  let typingTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (typing.length > 0) {
      setShowTyping(true);
    } else {
      // Give the exit animation time to finish (e.g., 300ms)
      const timeout = setTimeout(() => setShowTyping(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [typing]);

  const groupedMessage: Record<string, IMessage[]> =
    groupMessagesByDate(messages);

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

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <Card className="chat-room-card" sx={{ width: { xs: "100%", md: "75%" } }}>
      <Box className="chat-room-header">
        {currentChat.username ? (
          <Badge
            overlap="circular"
            variant="dot"
            color="success"
            invisible={!currentChat.online}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
        {Object.entries(groupedMessage).map(([date, groupedMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <Box sx={{ textAlign: "center" }}>
              <Chip
                label={date}
                size="small"
                sx={{ fontSize: "0.75rem", padding: "0.25rem" }}
              />
            </Box>

            {/* Messages */}
            {groupedMessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
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
                    <IconButton onClick={() => setShowPicker((prev) => !prev)}>
                      <InsertEmoticonIcon />
                    </IconButton>
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
          {showPicker && (
            <div
              ref={pickerRef}
              style={{
                position: "absolute",
                bottom: "60px", // push it above input
                right: "50px", // align with button
                zIndex: 1000,
              }}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={mode === "dark" ? Theme.DARK : Theme.LIGHT}
              />
            </div>
          )}
        </form>
      </div>
    </Card>
  );
};

export default ChatRoom;
