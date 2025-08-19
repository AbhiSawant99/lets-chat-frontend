import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

declare module "@mui/material/styles" {
  interface Palette {
    back: Palette["primary"];
    foreground: Palette["primary"];
    messageSelf: {
      background: string;
      text: string;
      subtext: string;
    };
    messageOther: {
      background: string;
      text: string;
      subtext: string;
    };
  }

  interface PaletteOptions {
    back?: PaletteOptions["primary"];
    foreground?: PaletteOptions["primary"];
    messageSelf?: {
      background: string;
      text: string;
      subtext: string;
    };
    messageOther?: {
      background: string;
      text: string;
      subtext: string;
    };
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
          dark: "#ebebeb",
        },
        foreground: {
          light: "#2f2f2fff",
          main: "#171717ff",
        },
        messageSelf: {
          background: "#0076ecff",
          text: "#ffffff",
          subtext: "#f5f5f5",
        },
        messageOther: {
          background: "#f0f0f0",
          text: "#000000",
          subtext: "#808080",
        },
      },
    },
    dark: {
      palette: {
        primary: { main: "#0076ecff" },
        back: {
          light: "#2f2f2fff",
          main: "#1b1b1b",
          dark: "#161616",
        },
        foreground: {
          light: "#ffffff",
          main: "#fafafa",
        },
        messageSelf: {
          background: "#0076ecff",
          text: "#ffffff",
          subtext: "#f5f5f5",
        },
        messageOther: {
          background: "#f0f0f0",
          text: "#000000",
          subtext: "#808080",
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
