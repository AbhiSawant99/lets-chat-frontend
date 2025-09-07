import { Box, keyframes } from "@mui/system";

const bounce = keyframes`
  0%, 20%, 100% { transform: translateY(0); }
  10% { transform: translateY(-20px); }
`;

export default function ConfettiBounceLoader() {
  const colors = [
    "primary.main",
    "primary.main",
    "primary.main",
    "primary.main",
    "primary.main",
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 1.5,
        height: 50,
        marginBottom: "1.5rem",
        alignItems: "flex-end",
      }}
    >
      {colors.map((color, i) => (
        <Box
          key={i}
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: color,
            animation: `${bounce} 2.5s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </Box>
  );
}
