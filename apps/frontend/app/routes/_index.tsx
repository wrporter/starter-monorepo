import { Alert, Container, Typography } from "@mui/material";
import { Check as CheckIcon } from "@mui/icons-material";

export default function Mui() {
  return (
    <Container fixed className="mt-4">
      <Typography variant="h1" fontSize={40}>
        Welcome to Remix with Material UI
      </Typography>

      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Material UI is working!
      </Alert>

      <div className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
        If this text is rainbow-colored, then Tailwind is working!
      </div>
    </Container>
  );
}
