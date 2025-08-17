import { useState } from "react";
import ChatList from "../../components/chat/chat-list";
import ChatRoom from "../../components/chat/chat-room";
import Layout from "../../components/layout";
import "./style.css";
import type { IChat } from "../../types/chat/chat.types";

const ChatPage = () => {
  const [currentRoomId, setCurrentRoomId] = useState<string>("");
  const [currentChat, setCurrentChat] = useState<IChat>({} as IChat);

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
        <ChatRoom currentRoomId={currentRoomId} currentChat={currentChat} />
      </div>
    </Layout>
  );
};

export default ChatPage;
