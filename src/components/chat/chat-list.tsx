import { Box, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppContext } from "../app-provider/app-context";
import { socket } from "../../api/socket";
import type { IChatList } from "../../types/chat/chat-list.types";

const ChatList = ({
  setPrivateMessageId,
}: {
  setPrivateMessageId: (userId: string) => void;
}) => {
  const [chatList, setChatList] = useState<IChatList[]>([]);
  const { user } = useAppContext();

  useEffect(() => {
    if (user) {
      console.log("user - ", user);
      socket.connect();
    }
  }, [user]);

  useEffect(() => {
    socket.on("users", (data) => {
      console.log("data - ", data);
      setChatList(data.users);
    });

    return () => {
      socket.off("users");
    };
  }, []);

  const openChat = (userId: string) => {
    setPrivateMessageId(userId);
  };

  return (
    <>
      {user && <h3>User: {user.displayName}</h3>}
      <Stack>
        {chatList.length > 0 &&
          chatList.map((chat) => (
            <Box
              key={chat.id}
              sx={{ padding: 2, borderBottom: "1px solid #ccc" }}
            >
              <h3>{chat.username}</h3>
              <h3>{chat.userId}</h3>
              <h3>online: {chat.online ? "Yes" : "No"}</h3>
              {/* <p>{chat.lastMessage}</p> */}
              <Button onClick={() => openChat(chat.userId)}>Connect</Button>
            </Box>
          ))}
      </Stack>
    </>
  );
};

export default ChatList;
