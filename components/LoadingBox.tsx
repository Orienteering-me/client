import { Box, CircularProgress } from "@mui/material";

function LoadingBox() {
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <CircularProgress
        color="primary"
        size="3rem"
        style={{
          position: "relative",
          marginTop: "40vh",
        }}
      />
    </Box>
  );
}

export default LoadingBox;
