import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

declare module "@mui/material/styles" {
  interface Palette {
    back: Palette["primary"];
    foreground: Palette["primary"];
  }

  interface PaletteOptions {
    back?: PaletteOptions["primary"];
    foreground?: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#0076ecff" },
        back: {
          light: "#ffffff",
          main: "#f5f5f5",
        },
        foreground: {
          light: "#2f2f2fff",
          main: "#171717ff",
        },
      },
    },
    dark: {
      palette: {
        primary: { main: "#003865ff" },
        back: {
          light: "#2f2f2fff",
          main: "#1b1b1b",
        },
        foreground: {
          light: "#ffffff",
          main: "#fafafa",
        },
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
