import React from "react";
import {
  SnackbarProvider as NotistackProvider,
  useSnackbar,
  closeSnackbar,
} from "notistack";
import { Alert } from "@mui/material";
import { SnackbarContext } from "@/types/snackbar-provider/snackbar-context";

// Define our context type
interface SnackbarContextType {
  showSnackbar: (
    msg: string | React.ReactNode,
    sev?: "success" | "error" | "warning" | "info",
    onClick?: () => void,
    icon?: React.ReactNode | boolean
  ) => void;
}

// Internal bridge to wrap enqueueSnackbar
function SnackbarController({ children }: { children: React.ReactNode }) {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar: SnackbarContextType["showSnackbar"] = (
    msg,
    sev = "info",
    onClick,
    icon = false
  ) => {
    enqueueSnackbar(msg, {
      variant: sev,
      // render with custom Alert so we keep styling
      content: (key, message) => (
        <Alert
          key={key}
          severity={sev}
          icon={icon}
          variant="filled"
          onClick={() => {
            if (onClick) onClick();
            closeSnackbar(key);
          }}
          sx={{ cursor: onClick ? "pointer" : "default" }}
        >
          {message}
        </Alert>
      ),
    });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotistackProvider
      maxSnack={2}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <SnackbarController>{children}</SnackbarController>
    </NotistackProvider>
  );
}
