import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import "./style.css";
import { useState } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const loginResponse = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (loginResponse.ok) {
      const userData = await loginResponse.json();
      localStorage.setItem("user", JSON.stringify(userData.user));
      navigate("/chat");
    } else {
      const errorData = await loginResponse.json();
      setError(`${errorData.message || "Unknown error"}`);
    }
  };

  return (
    <Box>
      <Card variant="outlined" className="login-card">
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleLogin}
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
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            fullWidth
            margin="normal"
            required
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
        <Button
          href="http://localhost:3000/auth/google"
          variant="outlined"
          color="info"
          type="button"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login with Google
        </Button>
        <Typography variant="body2" className="signup">
          Don’t have an account? <Link to="/sign-up">Sign up</Link>
        </Typography>
      </Card>
    </Box>
  );
};

export default LoginPage;
