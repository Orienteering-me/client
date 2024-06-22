import { useContext, useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { AuthContext, ErrorContext } from "./_app";
import LoadingBox from "../components/LoadingBox";
import ForbiddenPage from "../components/ForbiddenPage";
import axios from "axios";

// Logout page
export default function Logout() {
  const auth = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);

  const [loggedOut, setLoggedOut] = useState<Boolean | null>(null);

  // Sends a request to the backend to logout
  async function logout() {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/logout`,
        {},
        {
          headers: {
            "Refresh-Token": auth.refreshToken,
          },
        }
      );
      if (response.status == 200) {
        auth.setRefreshToken("");
        auth.setAccessToken("");
        sessionStorage.removeItem("orienteering-me-access-token");
        localStorage.removeItem("orienteering-me-refresh-token");
        setLoggedOut(true);
      }
    } catch (error) {
      console.log(error);
      // The error is only showed if the error was a server error, else logsout in the frontend because the backend data is deleted anyways
      if (error.response.status == 500) {
        errorContext.setError(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      } else {
        sessionStorage.removeItem("orienteering-me-access-token");
        localStorage.removeItem("orienteering-me-refresh-token");
        setLoggedOut(true);
      }
    }
  }

  useEffect(() => {
    // Runs only the first time the page is loaded
    if (loggedOut == null && auth.refreshToken != null) {
      if (auth.refreshToken != "") {
        logout();
      } else {
        setLoggedOut(false);
      }
    }
  }, [auth]);

  if (auth.refreshToken == null) {
    return <LoadingBox />;
  } else if (loggedOut == false) {
    return (
      <ForbiddenPage
        title="No has iniciado sesión o no tienes permiso"
        message="No puedes cerrar sesión sin iniciar sesión previamente"
        button_href="/login"
        button_text="Iniciar sesión"
      />
    );
  } else if (loggedOut) {
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
              marginBottom: "1rem",
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
      </Container>
    );
  } else {
    return <LoadingBox />;
  }
}
