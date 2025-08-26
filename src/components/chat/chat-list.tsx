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
import { socket } from "../../api/socket";
import type { IChat } from "../../types/chat/chat.types";
import ChatUsersCard from "./chat-user-card";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import type { IMessage } from "../../types/chat/message.types";
import Modal from "../modal";
import AddNewChat from "./add-new-chat";
import { getChat } from "@/api/chat";

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
  const [showAddChat, setShowAddChat] = useState<boolean>(false);
  const { user } = useAppContext();
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (user && !hasConnectedRef.current) {
      socket.connect();
      hasConnectedRef.current = true;
    }
  }, [user]);

  useEffect(() => {
    socket.on("chats", (chat) => {
      const sortedChats = chat.sort((listUser1: IChat, listUser2: IChat) => {
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

    socket.on("receive_private_notification", (message: IMessage) => {
      setChatList((prev) => {
        if (prev.some((chat) => chat.id === message.chatId)) {
          return prev.map((chat) =>
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
          );
        } else {
          addNewChat(message);
          return prev;
        }
      });
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
      setChatList((prev) => {
        if (prev.some((chat) => chat.id === message.chatId)) {
          return prev.map((chat) =>
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
          );
        } else {
          addNewChat(message);
          return prev;
        }
      });
    });

    socket.on("chat_created", (chat: IChat) => {
      setChatList((prev) =>
        prev.some((oldChat) => oldChat.id === chat.id) ? prev : [...prev, chat]
      );
    });

    socket.on("history_message_seen", (messages: IMessage[]) => {
      const lastMessage = messages[messages.length - 1];

      setChatList((prev) =>
        prev.map((chat) =>
          lastMessage && chat.id === lastMessage.chatId
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
      socket.off("chat_created");
    };
  }, [user]);

  const addNewChat = (message: IMessage) => {
    getChat(message.chatId).then(async (response) => {
      if (response.ok) {
        const newChat: IChat = await response.json();

        setChatList((prev) =>
          prev.some((chat) => chat.id === newChat.id)
            ? prev
            : [...prev, newChat]
        );
      }
    });
  };

  const openChat = (chat: IChat) => {
    if (!chat.roomId) return;
    setPrivateMessageId(chat.roomId);
    setCurrentChat(chat);
    socket.emit("join_private_room", chat.roomId);
  };

  return (
    <>
      <Card
        className="chat-list-card"
        sx={{ width: { xs: "100%", md: "30%" } }}
      >
        <div className="chat-list-header">
          <Typography variant="h5">LetsChat</Typography>
          <IconButton
            aria-label="add-friend"
            color="primary"
            onClick={() => setShowAddChat(true)}
          >
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
                  self={chat.userId === user?.id}
                  currentChat={chat.userId === currentChat.userId}
                  user={user}
                />
              ))}
        </Stack>
      </Card>

      <Modal
        open={showAddChat}
        onClose={() => setShowAddChat(false)}
        title="Add new chat"
        maxWidth="sm"
        fullWidth
        modalContent={
          <AddNewChat
            openChat={openChat}
            closeModal={() => setShowAddChat(false)}
          />
        }
      />
    </>
  );
};

export default ChatList;
