import * as React from "react";
import { styled } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  borderRadius: 3,
  backgroundColor: theme.palette.grey[400],
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

interface Props {
  content: React.ReactNode;
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose?: () => void;
}
export default function StickyChatDrawer({
  content,
  open,
  setOpen,
  onClose,
}: Props) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    setOpen(false);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={handleClose}
      swipeAreaWidth={30}
      PaperProps={{
        sx: {
          borderRadius: "1rem",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Puller />
      </Box>
      <Box sx={{ height: "100%", overflowY: "auto" }}>{content}</Box>
    </SwipeableDrawer>
  );
}
