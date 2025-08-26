import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/pages/login/style.css";
import ProfileImageUploader from "@/components/image-uploader";
import { useAppContext } from "@/components/app-provider/app-context";

const UsernameForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [availability, setAvailability] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const { setUser } = useAppContext();

  useEffect(() => {
    if (!username) {
      setAvailability(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/auth/check-username?username=${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await res.json();
        setAvailability(data.available);
      } catch (err) {
        console.error(err);
        setAvailability(false);
      } finally {
        setLoading(false);
      }
    }, 500); // wait 500ms after user stops typing

    return () => clearTimeout(delayDebounce);
  }, [username]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    const formData = new FormData(event.target as HTMLFormElement);
    // formData.append("username", username);
    if (photo) {
      formData.append("photo", photo); // photo should be a File (from <input type="file" /> or drag-drop)
    }
    const signupResponse = await fetch(
      "http://localhost:3000/auth/sign-final-step",
      {
        method: "POST",
        body: formData, // no need to set Content-Type manually
        credentials: "include",
      }
    );

    if (signupResponse.ok) {
      const userData = await signupResponse.json();
      setUser(userData.user);
      localStorage.setItem("user", JSON.stringify(userData.user));
      navigate("/chat");
    } else {
      const errorData = await signupResponse.json();
      setError(`${errorData.message || "Unknown error"}`);
    }
  };

  return (
    <Box className="login-container">
      {/* decorative background image top-left */}
      <img src="/logo.png" className="bg-img top-left" alt="bg" />

      {/* decorative background image bottom-right */}
      <img src="/logo.png" className="bg-img bottom-right" alt="bg" />
      <Box className="login-wrapper">
        <Card className="logo-circle">
          <img src="/logo.png" alt="logo" />
        </Card>
        <Card className="login-card">
          <Typography variant="h4" className="login-title">
            Final details
          </Typography>
          <Typography variant="caption">
            Help others to find you through profile picture and unique username
          </Typography>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            className="form-container"
          >
            <ProfileImageUploader savePhoto={setPhoto} />
            <div>
              <TextField
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
              />
              {username && (
                <Typography
                  variant="body2"
                  color={
                    availability === null
                      ? "textSecondary"
                      : availability
                        ? "green"
                        : "red"
                  }
                >
                  {loading
                    ? "Checking..."
                    : availability === null
                      ? ""
                      : availability
                        ? "✅ Username is available"
                        : "❌ Username already taken"}
                </Typography>
              )}
            </div>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default UsernameForm;
