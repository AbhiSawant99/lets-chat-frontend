import { useState } from "react";
import ChatList from "../../components/chat/chat-list";
import ChatRoom from "../../components/chat/chat-room";
import Layout from "../../components/layout";
import "./style.css";
import type { IChat } from "../../types/chat/chat.types";
import StickyChatDrawer from "../../components/swipable-drawer";
import { useMediaQuery, useTheme } from "@mui/material";
import SelectChat from "../../components/chat/select-chat";

const ChatPage = () => {
  const [currentRoomId, setCurrentRoomId] = useState<string>("");
  const [currentChat, setCurrentChat] = useState<IChat>({} as IChat);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const setPrivateMessageId = (roomId: string) => {
    setCurrentRoomId(roomId);
  };

  return (
    <Layout>
      <div className="chat-page">
        <ChatList
          setPrivateMessageId={setPrivateMessageId}
          setCurrentChat={setCurrentChat}
          currentChat={currentChat}
        />
        {!isSmall && currentChat?.userId && (
          <ChatRoom currentRoomId={currentRoomId} currentChat={currentChat} />
        )}
        {!isSmall && !currentChat?.userId && <SelectChat />}
        {isSmall && currentChat?.userId && (
          <StickyChatDrawer
            children={
              <ChatRoom
                currentRoomId={currentRoomId}
                currentChat={currentChat}
              />
            }
          />
        )}
      </div>
    </Layout>
  );
};

export default ChatPage;
