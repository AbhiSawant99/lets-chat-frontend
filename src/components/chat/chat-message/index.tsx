import React, { useState } from "react";
import { Card, CardContent, Menu, MenuItem, Typography } from "@mui/material";
import type { IMessage } from "@/types/chat/message.types";
import { DateTime } from "luxon";
import "./styles.css";
import { useAppContext } from "@/components/app-provider/app-context";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const ChatMessage = React.memo(
  ({
    message,
    handleDelete,
  }: {
    message: IMessage;
    handleDelete: (id: string) => void;
  }) => {
    const date = DateTime.fromISO(message.createdAt).toFormat("HH:mm");
    const { user } = useAppContext();
    const [contextMenu, setContextMenu] = useState<{
      mouseX: number;
      mouseY: number;
      messageId: string;
    } | null>(null);

    const handleDeleteClick = (id: string) => {
      handleDelete(id);
      setContextMenu(null);
    };

    const handleMenuClick = (e: React.MouseEvent) => {
      e.preventDefault(); // prevent default browser menu
      setContextMenu({
        mouseX: e.clientX,
        mouseY: e.clientY,
        messageId: message.id,
      });
    };

    return (
      <div
        className={`message-container ${user?.displayName === message.from ? "message-container-self" : "message-container-other"}`}
      >
        <Card
          className={`${user?.displayName === message.from ? "message-self" : "message-other"}`}
          elevation={0}
        >
          <CardContent
            className="message-content"
            sx={{ position: "relative" }}
          >
            <Typography variant="body2" sx={{ display: "block" }}>
              {message.message}
            </Typography>

            <div className="message-timestamp">
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.6rem",
                  letterSpacing: "0",
                  display: "block",
                }}
              >
                {date}
              </Typography>
              {user?.displayName === message.from &&
                message.status !== "deleted" && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.6rem",
                      letterSpacing: "0",
                      ml: "0.25rem",
                      display: "block",
                    }}
                  >
                    {message.status}
                  </Typography>
                )}
            </div>

            {/* options icon fixed in the corner */}
            {user?.displayName === message.from &&
              message.status !== "deleted" && (
                <MoreVertIcon
                  fontSize="small"
                  onClick={handleMenuClick}
                  className="menu-icon"
                />
              )}
          </CardContent>
        </Card>
        <Menu
          open={Boolean(contextMenu)}
          onClose={() => setContextMenu(null)}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem
            onClick={() => handleDeleteClick(contextMenu?.messageId ?? "")}
            className="message-menu-item delete"
          >
            <DeleteOutlineIcon className="menu-item-icon" />
            Delete
          </MenuItem>
        </Menu>
      </div>
    );
  }
);

export default ChatMessage;
