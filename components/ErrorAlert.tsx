import { Alert } from "@mui/material";

interface ErrorProps {
  error: string;
}

function ErrorAlert({ error }: ErrorProps) {
  return Boolean(error) ? (
    <Alert
      variant="filled"
      severity="error"
      style={{
        marginTop: 95,
        position: "absolute",
        zIndex: 999,
      }}
    >
      {error}
    </Alert>
  ) : (
    <></>
  );
}

export default ErrorAlert;
