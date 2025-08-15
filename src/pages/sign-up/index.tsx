import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { useAppContext } from "../../components/app-provider/app-context";
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
    <Box className="myClass">
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSignup}
      >
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          required
        />
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
          Sign Up
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
    </Box>
  );
};

export default SignUp;
