import { Card, Typography } from "@mui/material";
import "./styles.css";
import type { IChat } from "../../../types/chat/chat.types";

const ChatUsersCard = ({
  chat,
  onClick,
}: {
  chat: IChat;
  onClick: () => void;
}) => {
  return (
    <Card className="chat-card" onClick={onClick}>
      <Typography variant="body1">{chat.username}</Typography>
    </Card>
  );
};

export default ChatUsersCard;
