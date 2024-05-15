import { useContext, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { TokenContext } from "./_app";

export default function Logout() {
  const token = useContext(TokenContext);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.removeItem("orienteering-me-token");
      setLoggedOut(true);
    }
  }, [token]);

  if (!loggedOut) {
    return (
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
          No has iniciado sesión
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
          Inicia sesión para poder ver esta página.
        </Typography>
        <Button
          variant="contained"
          href="/login"
          style={{
            marginTop: 50,
            marginBottom: 5,
            marginLeft: "20%",
            color: "white",
            fontWeight: 700,
            width: "60%",
          }}
          color="primary"
        >
          Iniciar sesión
        </Button>
      </Box>
    );
  }

  return (
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
  );
}
