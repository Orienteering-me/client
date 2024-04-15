import { useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import ResponsiveAppBar from "../components/ResponsiveAppBar";

export default function Home() {
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
            width: "80%",
            borderRadius: "25px",
          }}
        >
          <Typography
            variant="h4"
            noWrap
            sx={{
              mt: 8,
              mb: 10,
              display: "flex",
              fontWeight: 700,
              letterSpacing: ".1rem",
              justifyContent: "center",
            }}
          >
            ¡Bienvenid@ a Orienteering.me!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 5,
              display: "flex",
              fontWeight: 500,
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            En Orienteering.me podrás crear carreras de orientación
            estableciendo puntos de control de forma sencilla directamente en un
            mapa, generando QRs para llevar el control de los participantes. Y
            si lo que buscas es participar, puedes buscar carreras en tu zona en
            nuestro buscador.
          </Typography>
          <Button
            type="submit"
            variant="contained"
            style={{
              marginBottom: 5,
              marginLeft: "15%",
              color: "white",
              fontWeight: 700,
              width: "70%",
            }}
          >
            Inicia sesión
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
