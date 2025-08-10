import { ThemeProvider, extendTheme } from "@mui/material/styles";
// import { CssBaseline } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { CssBaseline } from "@mui/material";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#0076ecff" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#003865ff" },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
