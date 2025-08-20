import { Box, Typography } from "@mui/material";
import "./style.css";

const SelectChat = () => {
  return (
    <Box
      className="select-chat-container"
      sx={{ height: "calc(100vh - 2rem)" }}
    >
      <img src="/logo.png" className="chat-logo" />
      <div>
        <Typography variant="h6" className="select-chat-text">
          Select a chat
        </Typography>
        <Typography variant="caption">
          or add a new friend to start the conversation!
        </Typography>
      </div>
    </Box>
  );
};

export default SelectChat;
