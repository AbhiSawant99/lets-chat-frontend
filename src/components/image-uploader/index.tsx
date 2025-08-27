import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Avatar, Badge, IconButton } from "@mui/material";
import { useAppContext } from "@/components/app-provider/app-context";
import CreateIcon from "@mui/icons-material/Create";
import "./styles.css";
import getImageUrl from "@/api/image-url.api";

export default function ProfileImageUploader({
  savePhoto,
}: {
  savePhoto: Dispatch<SetStateAction<File | null>>;
}) {
  const { user } = useAppContext();
  const [image, setImage] = useState<string>("");

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
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeContent={
        <IconButton component="label" className="edit-picture-button">
          <CreateIcon />
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
          />
        </IconButton>
      }
    >
      <Avatar
        alt={user?.displayName}
        src={image}
        className="image-avatar"
        slotProps={{
          img: {
            loading: "lazy",
          },
        }}
      />
    </Badge>
  );
}
