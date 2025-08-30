import { Avatar, Badge, Typography } from "@mui/material";
import "./styles.css";
import type { IChat } from "@/types/chat/chat.types";
import type { AuthUser } from "@/types/app-provider/app-context";
import getImageUrl from "@/api/image-url.api";

const ChatUsersCard = ({
  chat,
  onClick,
  self,
  currentChat,
  user,
}: {
  chat: IChat;
  onClick: () => void;
  self?: boolean;
  currentChat?: boolean;
  user?: AuthUser;
}) => {
  return (
    <div
      className={`chat-card ${currentChat ? "current-chat" : ""}`}
      onClick={onClick}
    >
      <div>
        <Badge
          overlap="circular"
          variant="dot"
          color="success"
          invisible={!chat.online}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Avatar
            alt={chat.username}
            src={`${getImageUrl(chat.photo)}`}
            sx={{ width: "3.125rem", height: "3.125rem" }}
            slotProps={{
              img: {
                loading: "lazy",
              },
            }}
          />
        </Badge>
      </div>
      <div>
        <Typography
          variant="body1"
          sx={{
            m: 0,
            lineHeight: 1,
            fontWeight: `${user?.id && chat.lastMessage?.readBy && !chat.lastMessage?.readBy?.includes(user?.id) ? 900 : 500}`,
          }}
        >
          {chat.username} {self && `(You)`}
        </Typography>
        {chat.lastMessage ? (
          <Typography
            variant="caption"
            noWrap
            sx={{
              m: 0,
              lineHeight: 0,
              fontWeight: `${user?.id && chat.lastMessage?.readBy && !chat.lastMessage?.readBy?.includes(user?.id) ? 900 : 500}`,
            }}
          >
            {chat.lastMessage.message}
          </Typography>
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
