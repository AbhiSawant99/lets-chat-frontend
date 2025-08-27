import { Avatar, Box, Drawer, IconButton, useColorScheme } from "@mui/material";
import { type ReactNode } from "react";
import SunnyIcon from "@mui/icons-material/Sunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "@/api/auth";
import { LightTooltip } from "@/components/tool-tip";
import { useAppContext } from "@/components/app-provider/app-context";

const Layout = ({ children }: { children: ReactNode }) => {
  const { user } = useAppContext();
  const { mode, setMode } = useColorScheme();

  const handleLogout = () => {
    logout();

    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          height: "100vh",
          width: "3.5rem",
          padding: "0.5rem 0rem",
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "100%",
            position: "unset",
            padding: "1rem 0rem",
            borderRadius: "0rem 1rem 1rem 0rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        }}
        slotProps={{
          root: {
            keepMounted: true, // Better open performance on mobile.
          },
        }}
        open
      >
        <Box className="layout-navigation-parent">
          <div className="layout-navigation">
            {/* <img src="/logo.png" className="layout-logo" /> */}
            <Avatar
              src={user?.photo && `http://localhost:3000${user.photo}`}
              alt={user?.displayName || "Profile"}
              className="layout-logo"
            />
          </div>
          <div className="layout-navigation">
            {mode === "light" ? (
              <LightTooltip title="Lights Off" placement="right">
                <IconButton
                  aria-label="dark"
                  onClick={() => setMode("dark")}
                  className="layout-buttons"
                >
                  {" "}
                  <DarkModeIcon />
                </IconButton>
              </LightTooltip>
            ) : (
              <LightTooltip title="Lights On" placement="right">
                <IconButton
                  aria-label="light"
                  onClick={() => setMode("light")}
                  className="layout-buttons"
                >
                  {" "}
                  <SunnyIcon />
                </IconButton>
              </LightTooltip>
            )}
            <LightTooltip title="Logout" placement="right">
              <IconButton
                aria-label="Logout"
                color="error"
                onClick={() => handleLogout()}
                className="layout-buttons"
              >
                <LogoutIcon />
              </IconButton>
            </LightTooltip>
          </div>
        </Box>
      </Drawer>
      <Box sx={{ width: "100%" }}>{children}</Box>
    </Box>
  );
};

export default Layout;
