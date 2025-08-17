import { Card, CardContent, Typography } from "@mui/material";
import type { IMessage } from "../../../types/chat/message.types";
import { DateTime } from "luxon";
import "./styles.css";
import { useAppContext } from "../../app-provider/app-context";

const ChatMessage = ({ message }: { message: IMessage }) => {
  const date = DateTime.fromISO(message.createdAt).toFormat("dd LLLL, HH:mm");
  const { user } = useAppContext();

  return (
    <div
      className={`message-container ${user?.displayName === message.from ? "message-container-self" : "message-container-other"}`}
    >
      <Card
        className={`${user?.displayName === message.from ? "message-self" : "message-other"}`}
      >
        <CardContent className="message-content">
          <Typography variant="body2">{message.message}</Typography>
          <div className="message-timestamp">
            <Typography
              variant="caption"
              sx={{ fontSize: "0.6rem", letterSpacing: "0" }}
            >
              {date}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatMessage;
