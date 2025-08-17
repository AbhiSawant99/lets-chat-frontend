import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../app-provider/app-context";
import { getRoomId, socket } from "../../api/socket";
import type { IChat } from "../../types/chat/chat.types";
import ChatUsersCard from "./chat-user-card";

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
    <div className="chat-list-card">
      {user && (
        <Box className="user-heading">
          <Typography variant="h5">{user.displayName}</Typography>
        </Box>
      )}
      {/* {user && <h3>User: </h3>} */}
      <Stack gap="1rem" px="1rem">
        {chatList.length > 0 &&
          chatList.map((chat) => (
            <ChatUsersCard chat={chat} onClick={() => openChat(chat)} />
          ))}
      </Stack>
    </div>
  );
};

export default ChatList;
