import { useContext, useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { TokenContext } from "./_app";
import LoadingBox from "../components/LoadingBox";
import ForbiddenPage from "../components/ForbiddenPage";

export default function Logout() {
  const token = useContext(TokenContext);

  const [loaded, setLoaded] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.removeItem("orienteering-me-token");
      setLoggedOut(true);
      setLoaded(true);
    } else {
      setLoaded(true);
    }
  }, [token]);

  if (!loaded) {
    return <LoadingBox />;
  } else {
    if (!loggedOut) {
      return (
        <ForbiddenPage
          title="No has iniciado sesión"
          message="No puedes cerrar sesión sin iniciar sesión previamente"
          button_href="/login"
          button_text="Iniciar sesión"
        />
      );
    } else {
      return (
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
            Sesión cerrada
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
            Se ha cerrado la sesión correctamente
          </Typography>
          <Button
            variant="contained"
            href="."
            style={{
              marginTop: 50,
              marginBottom: 5,
              marginLeft: "15%",
              color: "white",
              fontWeight: 700,
              width: "70%",
              justifyContent: "center",
              textAlign: "center",
            }}
            color="primary"
          >
            Volver al inicio
          </Button>
        </Box>
      );
    }
  }
}
