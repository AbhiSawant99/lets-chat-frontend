import { Avatar, Typography } from "@mui/material";
import "./styles.css";
import type { IChat } from "../../../types/chat/chat.types";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const ChatUsersCard = ({
  chat,
  onClick,
  self,
  currentChat,
}: {
  chat: IChat;
  onClick: () => void;
  self?: boolean;
  currentChat?: boolean;
}) => {
  return (
    <div
      className={`chat-card ${currentChat ? "current-chat" : ""}`}
      onClick={onClick}
    >
      <div>
        <Avatar
          alt={chat.username}
          src="/broken-image.jpg"
          sx={{ width: "3.125rem", height: "3.125rem" }}
        >
          <PersonRoundedIcon sx={{ fontSize: "1.75rem" }} />
        </Avatar>
      </div>
      <div>
        <Typography
          variant="body1"
          sx={{ m: 0, lineHeight: 1, fontWeight: 500 }}
        >
          {chat.username} {self && `(You)`}
        </Typography>
        {chat.lastMessage ? (
          <Typography variant="caption">{chat.lastMessage.message}</Typography>
        ) : (
          <Typography variant="caption" sx={{ m: 0, lineHeight: 0 }}>
            Start Chatting
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ChatUsersCard;
