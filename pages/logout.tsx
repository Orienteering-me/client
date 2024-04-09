import { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

export default function Logout() {
  const [token, setToken] = useState("");

  useEffect(() => {
    logout();
  }, []);

  function logout() {
    setToken("");
    localStorage.removeItem("jwt-token");
  }

  return (
    <Container maxWidth="lg" style={{ width: "100%" }}>
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveAppBar></ResponsiveAppBar>
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            padding: "2% 5%",
            backgroundColor: "#ffffff",
            width: "90%",
            borderRadius: "25px",
          }}
        >
          <Typography
            variant="h4"
            noWrap
            sx={{
              mt: 2,
              mb: 2,
              display: "flex",
              fontWeight: 700,
              letterSpacing: ".1rem",
            }}
          >
            Sesión cerrada
          </Typography>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mt: 2,
              mb: 2,
              display: "flex",
              fontWeight: 500,
            }}
          >
            Se ha cerrado la sesión correctamente.
          </Typography>
          <Button
            variant="contained"
            href="."
            style={{
              marginTop: 15,
              marginBottom: 5,
              fontWeight: 700,
              color: "white",
            }}
            color="primary"
          >
            Volver a la página principal
          </Button>
        </Box>
      </Box>
      Photo by <a href="https://martinvorel.com/">Martin Vorel</a>
    </Container>
  );
}
