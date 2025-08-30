import * as React from "react";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

interface ModalProps extends DialogProps {
  open: boolean;
  onClose: () => void;
  modalContent: React.ReactNode;
  action?: React.ReactNode;
  headless?: boolean;
  title: string;
}

export default function Modal({
  open,
  onClose,
  modalContent,
  action,
  headless,
  title,
  ...props
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...props}
    >
      {!headless && (
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "0.5rem",
          }}
        >
          {title}
          <IconButton onClick={onClose}>
            <CancelIcon />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent>{modalContent}</DialogContent>
      {action && <DialogActions>{action}</DialogActions>}
    </Dialog>
  );
}
