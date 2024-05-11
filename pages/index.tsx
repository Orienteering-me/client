import { Box, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LoadingBox from "../components/LoadingBox";
import ErrorAlert from "../components/ErrorAlert";

const MainPageMap = dynamic(() => import("../components/maps/MainPageMap"), {
  ssr: false,
});

interface CourseProps {
  name: string;
  admin: { _id: string; name: string };
  checkpoints: [
    { _id: string; number: number; lat: number; lng: number; qr_code: number }
  ];
}

export default function Main() {
  const [token, setToken] = useState("");
  const [courses, setCourses] = useState([]);

  const [loaded, setLoaded] = useState(false);

  const [errorRetrievingData, setErrorRetrievingData] = useState("");

  async function getData() {
    const token = localStorage.getItem("jwt-token");

    if (token) {
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
          setCourses(
            response.data.map((course: CourseProps) => {
              return {
                name: course.name,
                admin: course.admin.name,
                lat: course.checkpoints[0].lat,
                lng: course.checkpoints[0].lng,
              };
            })
          );
        } else {
          setErrorRetrievingData(
            "Ha ocurrido un error inesperado cargando las carreras disponibles."
          );
        }
      } catch (error: unknown) {
        if (error.response.status == 401) {
          setErrorRetrievingData(
            "No tienes permisos para acceder a este recurso. Pruebe a volver a iniciar sesión."
          );
          console.log(error);
        } else if (error.response.status == 404) {
          setErrorRetrievingData(
            "No tienes permisos para acceder a este recurso. Pruebe a volver a iniciar sesión."
          );
          console.log(error);
        } else {
          setErrorRetrievingData(
            "Ha ocurrido un error inesperado cargando las carreras disponibles."
          );
          console.log(error);
        }
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    setToken(token!);
    setLoaded(true);

    getData();
  }, []);

  if (!loaded) {
    return <LoadingBox />;
  } else {
    if (!token) {
      return (
        <Box
          sx={{
            mt: { xs: 15, md: 20 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            padding: "2% 5%",
            backgroundColor: "#ffffff",
            width: { xs: "80%", md: "50%" },
            borderRadius: "25px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mt: 6,
              mb: 8,
              display: "flex",
              fontWeight: 700,
              letterSpacing: ".1rem",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            ¡Bienvenid@ a Orienteering.me!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 6,
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
            variant="contained"
            href="/login"
            style={{
              marginBottom: 8,
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
    } else {
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
          <ErrorAlert error={errorRetrievingData} />
          <MainPageMap courses={courses} />
        </Container>
      );
    }
  }
}
