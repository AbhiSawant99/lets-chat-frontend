import { Stack, Typography } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Stack
      sx={{
        margin: "0 auto",
        height: "100vh",
        width: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h1"
        noWrap
        sx={{ letterSpacing: "1rem", fontWeight: 500 }}
      >
        404
      </Typography>
      <Typography variant="body1">Page not found</Typography>
    </Stack>
  );
};

export default NotFoundPage;
