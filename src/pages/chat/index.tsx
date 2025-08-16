import { Button } from "@mui/material";
import ChatList from "../../components/chat/chat-list";
import ChatRoom from "../../components/chat/chat-room";
import { useState } from "react";

const ChatPage = () => {
  const [currentRoomId, setCurrentRoomId] = useState<string>("");

  const handleLogout = async () => {
    const logoutResponse = await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (logoutResponse.ok) {
      localStorage.removeItem("user");
      window.location.href = "/";
    } else {
      console.error("Logout failed");
    }
  };

  const setPrivateMessageId = (roomId: string) => {
    setCurrentRoomId(roomId);
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <ChatList setPrivateMessageId={setPrivateMessageId} />
      <ChatRoom currentRoomId={currentRoomId} />
    </>
  );
};

export default ChatPage;
