import {
  Avatar,
  Box,
  Card,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ChatUsersCard from "./chat-user-card";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddNewChat from "./add-new-chat";
import { getChat } from "@/api/chat.api";
import type { IChat } from "@/types/chat/chat.types";
import { useAppContext } from "@/components/app-provider/app-context";
import { socket } from "@/api/socket.api";
import type { IMessage } from "@/types/chat/message.types";
import Modal from "@/components/modal";
import ChatListSkeleton from "@/components/chat/chat-list-skeleton";
import { useSnackbar } from "@/components/snackbar-provider/snackbar-context";
import getImageUrl from "@/api/image-url.api";

const ChatList = ({
  setPrivateMessageId,
  setCurrentChat,
  currentChat,
  setLoadingChat,
  setDrawerOpen,
}: {
  setPrivateMessageId: (userId: string) => void;
  setCurrentChat: (chat: IChat) => void;
  currentChat: IChat;
  setLoadingChat: (loading: boolean) => void;
  setDrawerOpen: (loading: boolean) => void;
}) => {
  const [chatList, setChatList] = useState<IChat[]>([]);
  const [search, setSearch] = useState<string>("");
  const [showAddChat, setShowAddChat] = useState<boolean>(false);
  const { user } = useAppContext();
  const { showSnackbar } = useSnackbar();
  const [loadingChatList, setLoadingChatList] = useState(true);
  const hasConnectedRef = useRef(false);

  const chatMessageNotification = (chat: IChat, message: IMessage) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Avatar
          alt={chat.username}
          src={`${getImageUrl(chat.photo)}`}
          sx={{ width: "2rem", height: "2rem" }}
          slotProps={{
            img: {
              loading: "lazy",
            },
          }}
        />
        <div>
          <Typography variant="body2">{chat.username}</Typography>
          <Typography variant="caption">{message.message}</Typography>
        </div>
      </Box>
    );
  };

  const stopLoading = () => {
    setTimeout(() => setLoadingChatList(false), 250);
  };

  useEffect(() => {
    if (user && !hasConnectedRef.current) {
      socket.connect();
      hasConnectedRef.current = true;
    }
  }, [user]);

  useEffect(() => {
    socket.on("chats", (chat) => {
      setChatList(chat);
      stopLoading();
    });

    socket.on("receive_private_notification", (message: IMessage) => {
      setChatList((prev) => {
        if (prev.some((chat) => chat.id === message.chatId)) {
          // find the chat and update it
          const updatedChatList = prev.map((chat) =>
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

          // move the updated chat to the top
          const updatedChat = updatedChatList.find(
            (chat) => chat.id === message.chatId
          )!;
          const remainingChats = updatedChatList.filter(
            (chat) => chat.id !== message.chatId
          );

          stopLoading();

          showSnackbar(
            chatMessageNotification(updatedChat, message),
            "info",
            () => openChat(updatedChat),
            false
          );

          return [updatedChat, ...remainingChats];
        } else {
          addNewChat(message);
          stopLoading();
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
          // find the chat and update it
          const updatedChatList = prev.map((chat) =>
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

          // move the updated chat to the top
          const updatedChat = updatedChatList.find(
            (chat) => chat.id === message.chatId
          )!;
          const remainingChats = updatedChatList.filter(
            (chat) => chat.id !== message.chatId
          );

          return [updatedChat, ...remainingChats];
        }
        return prev;
      });
    });

    socket.on("chat_created", (chat: IChat) => {
      setChatList((prev) =>
        prev.some((oldChat) => oldChat.id === chat.id) ? prev : [chat, ...prev]
      );
      stopLoading();
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
      setChatList((prev) => {
        const updatedChatList = prev.map((chat) =>
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

        // move the updated chat to the top
        const updatedChat = updatedChatList.find(
          (chat) => chat.id === message.chatId
        )!;
        const remainingChats = updatedChatList.filter(
          (chat) => chat.id !== message.chatId
        );

        return [updatedChat, ...remainingChats];
      });
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
    getChat(message.chatId).then((response) => {
      const newChat: IChat = response;

      setChatList((prev) =>
        prev.some((chat) => chat.id === newChat.id) ? prev : [newChat, ...prev]
      );

      showSnackbar(
        chatMessageNotification(newChat, message),
        "info",
        () => openChat(newChat),
        false
      );
    });
  };

  const openChat = (chat: IChat) => {
    if (!chat.roomId) return;
    setLoadingChat(true);
    setDrawerOpen(true);
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
        {loadingChatList ? (
          <ChatListSkeleton />
        ) : (
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
        )}
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
