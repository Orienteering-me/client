import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
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
    const token = localStorage.getItem("jwt-token");
    setToken(token!);

    if (token) {
      getData();
    }
  }, []);

  if (!token) {
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
  );
}
