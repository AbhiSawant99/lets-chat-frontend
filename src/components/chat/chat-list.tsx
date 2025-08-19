import { Card, InputAdornment, Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../app-provider/app-context";
import { getRoomId, socket } from "../../api/socket";
import type { IChat } from "../../types/chat/chat.types";
import ChatUsersCard from "./chat-user-card";
import SearchIcon from "@mui/icons-material/Search";

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
  const [search, setSearch] = useState<string | null>(null);
  const { user } = useAppContext();
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (user && !hasConnectedRef.current) {
      socket.connect();
      hasConnectedRef.current = true;
    }
  }, [user]);

  useEffect(() => {
    socket.on("users", (data) => {
      const sortedChats = data.users.sort(
        (listUser1: IChat, listUser2: IChat) => {
          if (listUser1?.userId === user?.id) {
            return -1;
          }
          if (listUser2?.userId === user?.id) {
            return 1;
          }

          return 0;
        }
      );
      setChatList(sortedChats);
      if (!currentChat.id && user) {
        openChat(sortedChats[0]);
      }
    });

    return () => {
      socket.off("users");
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
    <Card className="chat-list-card" sx={{ width: { xs: "100%", md: "30%" } }}>
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
      <Stack className="chat-list">
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
                chat={chat}
                onClick={() => openChat(chat)}
                self={index === 0}
                currentChat={chat.userId === currentChat.userId}
              />
            ))}
      </Stack>
    </Card>
  );
};

export default ChatList;
