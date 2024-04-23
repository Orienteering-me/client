import { useEffect, useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import axios from "axios";
import FormDialog from "../components/FormDialog";

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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/users`,
        {
          headers: {
            "jwt-token": token,
          },
        }
      );

      if (response.status == 200) {
        setUserData(response.data);
      } else {
        alert(
          "Ha ocurrido un error inesperado. Por favor, inténtelo más tarde."
        );
      }
    } catch (error) {
      if (error.response.status == 401) {
        alert("No tienes permisos para acceder a este recurso.");
      } else if (error.response.status == 404) {
        alert("La cuenta actual no existe.");
      } else {
        alert(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
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
      <FormDialog></FormDialog>
    </Box>
  );
}
