import { SnackbarContext } from "@/types/snackbar-provider/snackbar-context";
import { useContext } from "react";

export const useSnackbar = () => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used inside SnackbarProvider");
  return ctx;
};
