import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useColorScheme,
} from "@mui/material";
import "./styles.css";
import SunnyIcon from "@mui/icons-material/Sunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { logout } from "../../api/auth";
import LogoutIcon from "@mui/icons-material/Logout";

const NavBar = () => {
  const { mode, setMode } = useColorScheme();
  const user = localStorage.getItem("user");

  const handleLogout = () => {
    logout();

    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <AppBar position="static">
      <Toolbar className="nav">
        <div className="nav-title">
          <img src="/logo.png" className="nav-logo" />
          <Typography variant="h5">Lets Chat</Typography>
        </div>

        <div className="nav-user-actions">
          {mode === "light" ? (
            <IconButton aria-label="dark" onClick={() => setMode("dark")}>
              {" "}
              <DarkModeIcon />
            </IconButton>
          ) : (
            <IconButton aria-label="light" onClick={() => setMode("light")}>
              {" "}
              <SunnyIcon />
            </IconButton>
          )}
          {user ? (
            <Button
              variant="contained"
              color="error"
              onClick={() => handleLogout()}
              disableElevation
              sx={{ px: "0.5rem", py: "0.5rem", minWidth: "2rem" }}
              title="Logout"
            >
              <LogoutIcon />
            </Button>
          ) : // <Button

          // >
          //   Logout
          // </Button>
          null}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
