import { alpha, Box, Skeleton } from "@mui/material";
import "@/components/chat/chat-message/styles.css";
import "@/components/chat/styles.css";

const ChatRoomSkeleton = () => {
  return (
    <Box className="chat-box">
      <div className="message-container message-container-self">
        <div
          className="message-self"
          style={{ width: "25%", height: "3.25rem", padding: "0.75rem" }}
        >
          <Skeleton
            variant="text"
            sx={(theme) => ({
              fontSize: "0.75rem",
              bgcolor: alpha(theme.palette.messageSelf.text, 0.2),
            })}
          />
          <Box
            className="message-timestamp"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Skeleton
              variant="text"
              width={50}
              sx={(theme) => ({
                fontSize: "0.5rem",
                textAlign: "right",
                bgcolor: alpha(theme.palette.messageOther.text, 0.2),
              })}
            />
          </Box>
        </div>
      </div>
      <div className="message-container message-container-other">
        <div
          className="message-other"
          style={{ width: "50%", height: "3.25rem", padding: "0.75rem" }}
        >
          <Skeleton
            variant="text"
            sx={(theme) => ({
              fontSize: "0.75rem",
              bgcolor: alpha(theme.palette.messageOther.text, 0.2),
            })}
          />
          <Box
            className="message-timestamp"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Skeleton
              variant="text"
              width={50}
              sx={(theme) => ({
                fontSize: "0.5rem",
                textAlign: "right",
                bgcolor: alpha(theme.palette.messageOther.text, 0.2),
              })}
            />
          </Box>
        </div>
      </div>
      <div className="message-container message-container-self">
        <div
          className="message-self"
          style={{ width: "45%", height: "3.25rem", padding: "0.75rem" }}
        >
          <Skeleton
            variant="text"
            sx={(theme) => ({
              fontSize: "0.75rem",
              bgcolor: alpha(theme.palette.messageSelf.text, 0.2),
            })}
          />
          <Box
            className="message-timestamp"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Skeleton
              variant="text"
              width={50}
              sx={(theme) => ({
                fontSize: "0.5rem",
                textAlign: "right",
                bgcolor: alpha(theme.palette.messageOther.text, 0.2),
              })}
            />
          </Box>
        </div>
      </div>
      <div className="message-container message-container-other">
        <div
          className="message-other"
          style={{ width: "20%", height: "3.25rem", padding: "0.75rem" }}
        >
          <Skeleton
            variant="text"
            sx={(theme) => ({
              fontSize: "0.75rem",
              bgcolor: alpha(theme.palette.messageOther.text, 0.2),
            })}
          />
          <Box
            className="message-timestamp"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Skeleton
              variant="text"
              width={50}
              sx={(theme) => ({
                fontSize: "0.5rem",
                textAlign: "right",
                bgcolor: alpha(theme.palette.messageOther.text, 0.2),
              })}
            />
          </Box>
        </div>
      </div>
    </Box>
  );
};

export default ChatRoomSkeleton;
