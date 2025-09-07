import { Box, Button, TextField, Typography } from "@mui/material";
import "./styles.css";
import "@/components/chat/select-chat/style.css";
import { useAppContext } from "@/components/app-provider/app-context";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HighlightOff, TaskAlt } from "@mui/icons-material";
import ProfileImageUploader from "@/components/image-uploader";
import { checkUsernameAvailability, updateUserProfile } from "@/api/user.api";

function Profile({ onClose }: { onClose: () => void }) {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);

  // Form state
  const [formValues, setFormValues] = useState({
    name: user?.displayName || "",
    username: user?.username || "",
    password: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [availability, setAvailability] = useState<null | boolean>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    if (user) {
      setFormValues({
        name: user?.displayName || "",
        username: user?.username || "",
        password: "",
      });
    }
  }, [user]);

  // Username availability check (debounced)
  useEffect(() => {
    if (
      !touched.username ||
      !formValues.username ||
      errors.username ||
      !validateUsername(formValues.username)
    ) {
      setAvailability(null);
      return;
    }

    if (!formValues.username || formValues.username === user?.username) {
      setAvailability(true);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setAvailability(false);
      setCheckingUsername(true);
      try {
        const data = await checkUsernameAvailability(formValues.username);
        setAvailability(data.available);
      } catch (err) {
        console.error(err);
        setAvailability(false);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formValues.username, errors.username]);

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-z0-9_]{4,}$/;
    return usernameRegex.test(username);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      setAvailability(null);
      validateField(name, formValues[name as keyof typeof formValues]);
    }
  };

  // Blur handler
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formValues[name as keyof typeof formValues]);
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "name" && !value.trim()) {
      error = "Name is required";
    }

    if (name === "username") {
      if (!validateUsername(value)) {
        error =
          "Invalid username (use 4+ lowercase letters, numbers, or underscores)";
      }
    }

    if (name === "password" && value && value.length < 6) {
      error = "Password must be at least 6 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const validateForm = () => {
    let valid = true;
    for (const key in formValues) {
      const isValid = validateField(
        key,
        formValues[key as keyof typeof formValues]
      );
      if (!isValid) valid = false;
    }
    return valid;
  };

  const changeUserImage = (file: File | null) => {
    setPhoto(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("username", formValues.username);
    if (formValues.password) formData.append("password", formValues.password);
    if (photo) formData.append("photo", photo);

    try {
      const saveUserDetailsResponse = await updateUserProfile(formData);
      setUser(saveUserDetailsResponse.user);
      localStorage.setItem(
        "user",
        JSON.stringify(saveUserDetailsResponse.user)
      );
      navigate(0);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const setSubmitDisabled = () => {
    return (
      loading ||
      !formValues.username ||
      !formValues.name ||
      (formValues.username !== user?.username && !availability)
    );
  };

  return (
    <>
      <Box className="profile-details-container">
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
            <ProfileImageUploader savePhoto={changeUserImage} />
          </div>

          <TextField
            label="Name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
            fullWidth
            required
          />

          <div>
            <TextField
              label="Username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.username && Boolean(errors.username)}
              helperText={
                touched.username && errors.username
                  ? errors.username
                  : "Use 4+ lowercase letters, numbers, or underscores"
              }
              fullWidth
              required
            />
            {formValues.username && !errors.username && (
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
                {checkingUsername ? (
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

          {/* <TextField
                label="Password"
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                fullWidth
              /> */}

          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant="outlined"
              color="error"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={setSubmitDisabled()}
              loading={loading}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Profile;
