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
    // <Box className="login-container">
    //   <Card variant="outlined" className="login-card">
    //     <Typography variant="h4" gutterBottom>
    //       Log In
    //     </Typography>
    //     <Box
    //       component="form"
    //       noValidate
    //       autoComplete="off"
    //       onSubmit={handleLogin}
    //     >
    //       {error && (
    //         <Typography color="error" variant="body2" gutterBottom>
    //           {error}
    //         </Typography>
    //       )}
    //       <TextField
    //         label="Email"
    //         type="email"
    //         name="email"
    //         fullWidth
    //         margin="normal"
    //         required
    //       />
    //       <TextField
    //         label="Password"
    //         type="password"
    //         name="password"
    //         fullWidth
    //         margin="normal"
    //         required
    //       />
    //       <Button
    //         variant="contained"
    //         color="primary"
    //         type="submit"
    //         fullWidth
    //         sx={{ mt: 2 }}
    //       >
    //         Login
    //       </Button>
    //     </Box>
    //     <Button
    //       href="http://localhost:3000/auth/google"
    //       variant="outlined"
    //       color="info"
    //       type="button"
    //       fullWidth
    //       sx={{ mt: 2 }}
    //     >
    //       Login with Google
    //     </Button>
    //     <Typography variant="body2" className="signup">
    //       Don’t have an account? <Link to="/sign-up">Sign up</Link>
    //     </Typography>
    //   </Card>
    // </Box>

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
            href="http://localhost:3000/auth/google"
            variant="outlined"
            fullWidth
            className="google-btn"
            startIcon={<GoogleIcon />}
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
