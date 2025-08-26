import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Avatar, Button } from "@mui/material";
import { useAppContext } from "@/components/app-provider/app-context";

export default function ProfileImageUploader({
  savePhoto,
}: {
  savePhoto: Dispatch<SetStateAction<File | null>>;
}) {
  const { user } = useAppContext();
  const [image, setImage] = useState<string>(
    "" // existing image fallback
  );

  useEffect(() => {
    if (user && user.photo) {
      setImage(`http://localhost:3000${user.photo}`);
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Show existing or uploaded image */}
      <Avatar
        src={image}
        alt={user?.displayName || "Profile"}
        sx={{ width: 100, height: 100, borderRadius: "50%" }}
      />

      {/* Upload button */}
      <Button variant="contained" component="label">
        Upload Image
        <input
          hidden
          accept="image/*"
          type="file"
          onChange={handleImageUpload}
        />
      </Button>
    </div>
  );
}
