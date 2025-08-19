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

const drawerHeight = 90; // percentage of screen

interface Props {
  children: React.ReactNode;
}
export default function StickyChatDrawer({ children }: Props) {
  const [open, setOpen] = React.useState(true);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      swipeAreaWidth={30}
      keepMounted // <= keep the children mounted in DOM
      PaperProps={{
        sx: {
          height: `${drawerHeight}vh`, // covers 90% of screen height
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ position: "relative", pt: 1 }}>
        <Puller />
      </Box>
      <Box sx={{ height: "100%", overflowY: "auto" }}>{children}</Box>
    </SwipeableDrawer>
  );
}
