import React, { useEffect, useRef, useState } from "react";
import { Avatar, Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { useAppContext } from "@/components/app-provider/app-context";
import CreateIcon from "@mui/icons-material/Create";
import "./styles.css";
import getImageUrl from "@/api/image-url.api";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

export default function ProfileImageUploader({
  savePhoto,
}: {
  savePhoto: (file: File | null) => void;
}) {
  const { user } = useAppContext();
  const [image, setImage] = useState<string>("");
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent default browser menu
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
  };

  useEffect(() => {
    if (user && user.photo) {
      setImage(getImageUrl(user.photo));
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      savePhoto(file);
      setImage(URL.createObjectURL(file)); // preview uploaded image
    }
  };

  return (
    <>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <IconButton
            component="label"
            className="edit-picture-button"
            onClick={handleMenuClick}
          >
            <CreateIcon />
          </IconButton>
        }
      >
        <Avatar
          alt={user?.displayName}
          src={image || "/default-avatar.png"}
          className="image-avatar"
          slotProps={{
            img: {
              loading: "lazy",
            },
          }}
        />
      </Badge>
      <Menu
        open={Boolean(contextMenu)}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          className="image-menu-item"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
        >
          <CreateOutlinedIcon className="menu-item-icon" />
          Edit
          <input
            ref={fileInputRef}
            hidden
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setImage("");
            savePhoto(null);
            setContextMenu(null);
          }}
          className="image-menu-item delete"
        >
          <DeleteOutlineIcon className="menu-item-icon" />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
