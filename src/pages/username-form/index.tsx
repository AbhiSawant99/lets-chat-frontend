import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/pages/login/style.css";
import ProfileImageUploader from "@/components/image-uploader";
import { useAppContext } from "@/components/app-provider/app-context";
import { TaskAlt, HighlightOff } from "@mui/icons-material";
import { requestSaveDetails } from "@/api/auth.api";
import { checkUsernameAvailability } from "@/api/user.api";

const UsernameForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [availability, setAvailability] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const { setUser } = useAppContext();
  const [touched, setTouched] = useState(false);

  const validateUsername = () => {
    const usernameRegex = /^[a-z0-9_]{4,}$/;
    return usernameRegex.test(username);
  };

  useEffect(() => {
    if (!username || !validateUsername()) {
      setAvailability(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await checkUsernameAvailability(username);
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
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const saveUserDetailsResponse = await requestSaveDetails(formData);
      setUser(saveUserDetailsResponse.user);
      localStorage.setItem(
        "user",
        JSON.stringify(saveUserDetailsResponse.user)
      );
      navigate("/chat");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <ProfileImageUploader savePhoto={setPhoto} />
            </div>
            <div>
              <TextField
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched(true)}
                helperText="Use 4+ lowercase letters, numbers, or underscores"
                error={touched && !validateUsername()}
                fullWidth
              />
              {username && (
                <Typography
                  variant="caption"
                  color={
                    availability === null
                      ? "textSecondary"
                      : availability
                        ? "green"
                        : "red"
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {loading ? (
                    "Checking..."
                  ) : availability === null ? (
                    ""
                  ) : availability ? (
                    <>
                      <TaskAlt sx={{ fontSize: "1.25rem" }} />
                      Username is Available
                    </>
                  ) : (
                    <>
                      <HighlightOff sx={{ fontSize: "1.25rem" }} />
                      Username is Taken
                    </>
                  )}
                </Typography>
              )}
            </div>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Button variant="text" color="info" type="button" fullWidth>
                Skip
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={!(availability && validateUsername())}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default UsernameForm;
