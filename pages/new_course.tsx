import { useEffect, useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import axios from "axios";
import FormDialog from "../components/FormDialog";
import dynamic from "next/dynamic";

const OpenStreetMapCreateCourse = dynamic(
  () => import("../components/OpenStreetMapCreate"),
  {
    ssr: false,
  }
);

export default function Account() {
  const [token, setToken] = useState("");
  const [name, setName] = useState("");

  async function getData() {
    const token = localStorage.getItem("jwt-token");
    setToken(token!);
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
      <form>
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
          Crear nueva carrera
        </Typography>
        <TextField
          required
          fullWidth
          id="name-input"
          label="Nombre de la carrera"
          variant="outlined"
          margin="normal"
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: "3%" }}
        />
        <OpenStreetMapCreateCourse />
        <Button
          type="submit"
          variant="contained"
          style={{
            marginTop: 25,
            marginBottom: 10,
            marginLeft: "5%",
            color: "white",
            fontWeight: 700,
            width: "90%",
          }}
        >
          Crear recorrido
        </Button>
      </form>
    </Box>
  );
}
