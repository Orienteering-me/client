import { Box, Button, Container, Typography } from "@mui/material";

interface ForbiddenPageProps {
  title: string;
  message: string;
  button_text: string;
  button_href: string;
}

// Forbidden page component to show in forbidden pages
function ForbiddenPage({
  title,
  message,
  button_text,
  button_href,
}: ForbiddenPageProps) {
  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      disableGutters
    >
      <Box
        sx={{
          mt: 25,
          mb: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "left",
          padding: "2% 5%",
          backgroundColor: "#ffffff",
          width: { xs: "90%", md: "50%" },
          borderRadius: "25px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mt: 2,
            mb: 2,
            display: "flex",
            fontWeight: 700,
            letterSpacing: ".1rem",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            mb: 2,
            display: "flex",
            fontWeight: 500,
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {message}
        </Typography>
        <Button
          variant="contained"
          href={button_href}
          style={{
            marginTop: 50,
            marginBottom: "1rem",
            marginLeft: "20%",
            color: "white",
            fontWeight: 700,
            width: "60%",
          }}
          color="primary"
        >
          {button_text}
        </Button>
      </Box>
    </Container>
  );
}

export default ForbiddenPage;
