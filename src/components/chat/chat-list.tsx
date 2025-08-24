import {
  Card,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../app-provider/app-context";
import { getRoomId, socket } from "../../api/socket";
import type { IChat } from "../../types/chat/chat.types";
import ChatUsersCard from "./chat-user-card";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import type { IMessage } from "../../types/chat/message.types";

const ChatList = ({
  setPrivateMessageId,
  setCurrentChat,
  currentChat,
}: {
  setPrivateMessageId: (userId: string) => void;
  setCurrentChat: (chat: IChat) => void;
  currentChat: IChat;
}) => {
  const [chatList, setChatList] = useState<IChat[]>([]);
  const [search, setSearch] = useState<string>("");
  const { user } = useAppContext();
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (user && !hasConnectedRef.current) {
      socket.connect();
      hasConnectedRef.current = true;
    }
  }, [user]);

  useEffect(() => {
    socket.on("chats", (data) => {
      const sortedChats = data.sort((listUser1: IChat, listUser2: IChat) => {
        if (listUser1?.userId === user?.id) {
          return -1;
        }
        if (listUser2?.userId === user?.id) {
          return 1;
        }

        return 0;
      });
      setChatList(sortedChats);
    });

    socket.on("receive_private_notification", (data: IMessage) => {
      setChatList((prev) =>
        prev.map((chat) =>
          chat.id === data.chatId
            ? {
                ...chat,
                lastMessage: {
                  chatId: data.chatId,
                  from: data.from,
                  id: data.id,
                  message: data.message,
                  status: data.status,
                  createdAt: data.createdAt,
                  readBy: data.readBy,
                },
              }
            : chat
        )
      );
    });

    socket.on("online_users", (users: string[]) => {
      setChatList((prev) =>
        prev.map((chat) => {
          return {
            ...chat,
            online: users.includes(chat.userId),
          };
        })
      );
    });

    socket.on("receive_private_message", (message: IMessage) => {
      setChatList((prev) =>
        prev.map((chat) =>
          chat.id === message.chatId
            ? {
                ...chat,
                lastMessage: {
                  chatId: message.chatId,
                  from: message.from,
                  id: message.id,
                  message: message.message,
                  status: message.status,
                  createdAt: message.createdAt,
                  readBy: message.readBy,
                },
              }
            : chat
        )
      );
    });

    socket.on("history_message_seen", (messages: IMessage[]) => {
      const lastMessage = messages[messages.length - 1];

      setChatList((prev) =>
        prev.map((chat) =>
          chat.id === lastMessage?.chatId
            ? {
                ...chat,
                lastMessage: {
                  chatId: lastMessage.chatId,
                  from: lastMessage.from,
                  id: lastMessage.id,
                  message: lastMessage.message,
                  status: lastMessage.status,
                  createdAt: lastMessage.createdAt,
                  readBy: lastMessage.readBy,
                },
              }
            : chat
        )
      );
    });

    socket.on("message_seen", (message: IMessage) => {
      setChatList((prev) =>
        prev.map((chat) =>
          chat.id === message.chatId
            ? {
                ...chat,
                lastMessage: {
                  chatId: message.chatId,
                  from: message.from,
                  id: message.id,
                  message: message.message,
                  status: message.status,
                  createdAt: message.createdAt,
                  readBy: message.readBy,
                },
              }
            : chat
        )
      );
    });

    return () => {
      socket.off("chats");
      socket.off("receive_private_notification");
      socket.off("receive_private_message");
      socket.off("online_users");
      socket.off("history_message_seen");
      socket.off("message_seen");
    };
  }, [user]);

  const openChat = (chat: IChat) => {
    if (!user || !user.id) return;
    const roomId = getRoomId(user.id, chat.userId);
    setPrivateMessageId(roomId);
    setCurrentChat(chat);
    socket.emit("join_private_room", roomId);
  };

  return (
    <>
      <Card
        className="chat-list-card"
        sx={{ width: { xs: "100%", md: "30%" } }}
      >
        <div className="chat-list-header">
          <Typography variant="h5">LetsChat</Typography>
          <IconButton aria-label="add-friend" color="primary">
            {" "}
            <AddCircleIcon />
          </IconButton>
        </div>
        <div>
          <TextField
            type="text"
            className="chat-list-search"
            placeholder="Search a chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "2rem",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
            }}
          />
        </div>
        <Stack className="chat-list custom-scroll">
          {chatList.length > 0 &&
            chatList
              .filter((c) => {
                if (search && search.length > 0) {
                  return c.username
                    .trim()
                    .toLocaleLowerCase()
                    .includes(search.trim().toLocaleLowerCase());
                } else {
                  return true;
                }
              })
              .map((chat, index) => (
                <ChatUsersCard
                  key={index}
                  chat={chat}
                  onClick={() => openChat(chat)}
                  self={index === 0}
                  currentChat={chat.userId === currentChat.userId}
                  user={user}
                />
              ))}
        </Stack>
      </Card>
    </>
  );
};

export default ChatList;
