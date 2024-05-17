import { Alert, IconButton, Snackbar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ErrorAlertProps {
  open: boolean;
  error: string;
  onClose: () => void;
}

function ErrorAlert({ open, error, onClose }: ErrorAlertProps) {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={onClose}
    >
      <Alert
        variant="filled"
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <Typography>{error}</Typography>
      </Alert>
    </Snackbar>
  );
}

export default ErrorAlert;
