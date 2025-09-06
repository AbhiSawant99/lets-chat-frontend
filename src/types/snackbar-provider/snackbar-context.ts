import React, { createContext } from "react";

export interface SnackbarContextType {
  showSnackbar: (
    message: string | React.ReactNode,
    severity?: "success" | "error" | "warning" | "info",
    onClick?: () => void,
    icon?: React.ReactNode | boolean
  ) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);
