import { Avatar, Badge, Box, Typography } from "@mui/material";
import "./styles.css";
import type { IChat } from "@/types/chat/chat.types";
import type { AuthUser } from "@/types/app-provider/app-context";
import getImageUrl from "@/api/image-url.api";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";

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
            src={`${getImageUrl(chat.photo)}` || "/default-avatar.png"}
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: 0,
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              noWrap
              sx={{
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight:
                  user?.id &&
                  chat.lastMessage?.readBy &&
                  !chat.lastMessage?.readBy?.includes(user?.id)
                    ? 900
                    : 500,
                maxWidth: "100%",
              }}
            >
              {chat.lastMessage.message}
            </Typography>

            {user?.id &&
              chat.lastMessage?.readBy &&
              !chat.lastMessage?.readBy?.includes(user?.id) && (
                <MarkChatUnreadIcon
                  sx={{
                    fontSize: "1rem",
                    right: "0",
                    position: "absolute",
                  }}
                />
              )}
          </Box>
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
