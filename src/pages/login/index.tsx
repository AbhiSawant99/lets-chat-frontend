import {
  Box,
  Button,
  Card,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";

import "./style.css";
import { useState } from "react";
import { requestLogin } from "@/api/auth.api";
import request, { BASE_URL } from "@/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setLoading(true);
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const userData = await requestLogin(email, password);
      localStorage.setItem("user", JSON.stringify(userData.user));
      navigate(userData.navigate);
      setLoading(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      // Hit the /ping endpoint to "wake up" the backend on Render.
      // This avoids showing Render's default "Starting..." splash screen
      await request("/ping").catch(() => {});

      // Give the backend a short time (~500ms) to finish waking up
      setTimeout(() => {
        window.location.href = `${BASE_URL}/auth/google`;
      }, 500);

      // (in case the redirect fails or is blocked, the UI won’t stay stuck).
      setTimeout(() => {
        setGoogleLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Ping failed", err);
      setGoogleLoading(false);
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
            Log In
          </Typography>

          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleLogin}
            className="form-container"
          >
            {error && (
              <Typography color="error" variant="body2" gutterBottom>
                {error}
              </Typography>
            )}

            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              className="login-input"
              required
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              className="login-input"
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="login-btn"
              loading={loading}
            >
              LOGIN
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              my: 3,
            }}
          >
            <Divider sx={{ flexGrow: 1, bgcolor: "#333" }} />
            <Typography sx={{ mx: 2 }}>OR</Typography>
            <Divider sx={{ flexGrow: 1, bgcolor: "#333" }} />
          </Box>
          <Button
            variant="outlined"
            fullWidth
            className="google-btn"
            onClick={handleGoogleLogin}
            startIcon={<GoogleIcon />}
            loading={googleLoading}
          >
            Login with Google
          </Button>

          <Typography variant="body2" className="signup-text">
            Don’t have an account? <Link to="/sign-up">Sign up</Link>
          </Typography>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
