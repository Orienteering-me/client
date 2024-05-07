import { Button, CircularProgress, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const OpenStreetMap = dynamic(() => import("../components/OpenStreetMap"), {
  ssr: false,
});

interface CourseProps {
  name: string;
  admin: { _id: string; name: string };
  checkpoints: [
    { _id: string; number: number; lat: number; lng: number; qr_code: number }
  ];
}

export default function Map() {
  const [token, setToken] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [courses, setCourses] = useState([]);

  async function getData() {
    const token = localStorage.getItem("jwt-token");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/courses`,
        {
          headers: {
            "jwt-token": token,
          },
        }
      );
      if (response.status == 200) {
        setCourses(response.data);
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
    getData();
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <Box
        sx={{
          position: "relative",
          marginTop: 0,
          display: "flex",
          justifyContent: "center",
          width: "40%",
        }}
      >
        <CircularProgress
          color="primary"
          style={{
            position: "relative",
            marginTop: "40%",
          }}
        />
      </Box>
    );
  } else {
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
            width: "80%",
            borderRadius: "25px",
          }}
        >
          <Typography
            variant="h4"
            noWrap
            sx={{
              mt: 6,
              mb: 8,
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
              mb: 4,
              display: "flex",
              fontWeight: 500,
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
            variant="contained"
            href="/login"
            style={{
              marginBottom: 10,
              marginLeft: "20%",
              color: "white",
              fontWeight: 700,
              width: "60%",
            }}
            color="primary"
          >
            Inicia sesión
          </Button>
        </Box>
      );
    }

    return (
      <OpenStreetMap
        courses={courses.map((course: CourseProps) => {
          return {
            name: course.name,
            admin: course.admin.name,
            lat: course.checkpoints[0].lat,
            lng: course.checkpoints[0].lng,
          };
        })}
      />
    );
  }
}
