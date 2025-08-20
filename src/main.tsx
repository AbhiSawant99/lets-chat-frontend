import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

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
  typography: {
    fontFamily: `'Quicksand', sans-serif`,
  },
  cssVariables: {
    colorSchemeSelector: "data",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#0091d0" },
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
          background: "#0091d0",
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
        primary: { main: "#0091d0" },
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
          background: "#0091d0",
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
