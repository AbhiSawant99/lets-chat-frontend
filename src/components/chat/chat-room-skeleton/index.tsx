import { alpha, Box, Card, Skeleton } from "@mui/material";
import "@/components/chat/chat-message/styles.css";
import "@/components/chat/styles.css";

const ChatRoomSkeleton = () => {
  return (
    <Box className="chat-box">
      <div className="message-container message-container-self">
        <Card
          className="message-self"
          sx={{ width: "25rem", height: "3.75rem", padding: "0.75rem" }}
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
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Skeleton
              variant="text"
              width={50}
              sx={(theme) => ({
                fontSize: "0.75rem",
                textAlign: "right",
                bgcolor: alpha(theme.palette.messageOther.text, 0.2),
              })}
            />
          </Box>
        </Card>
      </div>
      <div className="message-container message-container-other">
        <Card
          className="message-other"
          sx={{ width: "25rem", height: "3.75rem", padding: "0.75rem" }}
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
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Skeleton
              variant="text"
              width={50}
              sx={(theme) => ({
                fontSize: "0.75rem",
                textAlign: "right",
                bgcolor: alpha(theme.palette.messageOther.text, 0.2),
              })}
            />
          </Box>
        </Card>
      </div>
      <div className="message-container message-container-self">
        <Card
          className="message-self"
          sx={{ width: "25rem", height: "3.75rem", padding: "0.75rem" }}
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
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Skeleton
              variant="text"
              width={50}
              sx={(theme) => ({
                fontSize: "0.75rem",
                textAlign: "right",
                bgcolor: alpha(theme.palette.messageOther.text, 0.2),
              })}
            />
          </Box>
        </Card>
      </div>
      <div className="message-container message-container-other">
        <Card
          className="message-other"
          sx={{ width: "25rem", height: "3.75rem", padding: "0.75rem" }}
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
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Skeleton
              variant="text"
              width={50}
              sx={(theme) => ({
                fontSize: "0.75rem",
                textAlign: "right",
                bgcolor: alpha(theme.palette.messageOther.text, 0.2),
              })}
            />
          </Box>
        </Card>
      </div>
    </Box>
  );
};

export default ChatRoomSkeleton;
