import { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import axios from "axios";

export default function Account() {
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState({
    email: "Cargando...",
    name: "Cargando...",
    phone_number: "Cargando...",
  });

  async function getData() {
    const token = localStorage.getItem("jwt-token");
    setToken(token!);
    try {
      console.log(token!);
      const response = await axios.get("http://127.0.0.1:3000/users", {
        headers: {
          "jwt-token": token,
        },
      });

      if (response.status == 200) {
        setUserData(response.data);
      } else {
        alert(
          "Ha ocurrido un error inesperado. Por favor, inténtelo más tarde."
        );
      }
    } catch (error) {}
  }

  useEffect(() => {
    getData();
  }, []);

  function logout() {
    setToken("");
    localStorage.removeItem("jwt-token");
  }

  if (!token) {
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
              Inicia sesión para poder ver esta página
            </Typography>
          </Box>
        </Box>
        Photo by <a href="https://martinvorel.com/">Martin Vorel</a>
      </Container>
    );
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
            Mi cuenta
          </Typography>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mt: 2,
              display: "flex",
              fontWeight: 700,
            }}
          >
            Correo electrónico
          </Typography>
          <Typography
            noWrap
            sx={{
              mt: 1,
              mb: 2,
              display: "flex",
              fontWeight: 500,
            }}
          >
            {userData.email}
          </Typography>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mt: 2,
              display: "flex",
              fontWeight: 700,
            }}
          >
            Nombre completo
          </Typography>
          <Typography
            noWrap
            sx={{
              mt: 1,
              mb: 2,
              display: "flex",
              fontWeight: 500,
            }}
          >
            {userData.name}
          </Typography>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mt: 2,
              display: "flex",
              fontWeight: 700,
            }}
          >
            Teléfono
          </Typography>
          <Typography
            noWrap
            sx={{
              mt: 1,
              mb: 2,
              display: "flex",
              fontWeight: 500,
            }}
          >
            {userData.phone_number}
          </Typography>
          <Button
            variant="contained"
            style={{
              marginTop: 15,
              marginBottom: 5,
              color: "white",
              backgroundColor: "red",
              fontWeight: 700,
            }}
          >
            Borrar cuenta
          </Button>
        </Box>
      </Box>
      Photo by <a href="https://martinvorel.com/">Martin Vorel</a>
    </Container>
  );
}
