import { Box, Skeleton, Stack } from "@mui/material";
import "@/components/chat/styles.css";
import "@/components/chat/chat-user-card/styles.css";

function ChatListSkeleton() {
  return (
    <Stack className="chat-list custom-scroll">
      <div className="chat-card">
        <div>
          <Skeleton variant="circular" width="3.125rem" height="3.125rem" />
        </div>
        <Box sx={{ width: "100%" }}>
          <Skeleton variant="text" sx={{ fontSize: "1rem", width: "100%" }} />
          <Skeleton
            variant="text"
            sx={{ fontSize: "0.75rem", width: "100%" }}
          />
        </Box>
      </div>
      <div className="chat-card">
        <div>
          <Skeleton variant="circular" width="3.125rem" height="3.125rem" />
        </div>
        <Box sx={{ width: "100%" }}>
          <Skeleton variant="text" sx={{ fontSize: "1rem", width: "100%" }} />
          <Skeleton
            variant="text"
            sx={{ fontSize: "0.75rem", width: "100%" }}
          />
        </Box>
      </div>
    </Stack>
  );
}

export default ChatListSkeleton;
