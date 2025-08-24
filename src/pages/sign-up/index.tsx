import { Box, Typography, TextField, Button, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const SignupResponse = await fetch("http://localhost:3000/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    });

    if (SignupResponse.ok) {
      navigate("/");
    } else {
      const errorData = await SignupResponse.json();
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
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Sign Up
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default SignUp;
