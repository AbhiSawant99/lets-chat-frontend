import { Box, Typography, TextField, Button, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "@/pages/login/style.css";
import { requestSignup } from "@/api/auth.api";

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setLoading(true);
    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await requestSignup({ name, email, password });
      navigate("/username-form");
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
            Sign Up
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSignup}
            className="form-container"
          >
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <TextField label="Name" name="name" fullWidth required />
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              required
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              loading={loading}
            >
              Sign Up
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default SignUp;
