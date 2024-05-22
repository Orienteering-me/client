import { Box, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import LoadingBox from "../components/LoadingBox";
import ErrorAlert from "../components/ErrorAlert";
import { TokenContext } from "./_app";

const MainPageMap = dynamic(() => import("../components/maps/MainPageMap"), {
  ssr: false,
});

interface APICourse {
  name: string;
  admin: { _id: string; name: string };
  checkpoints: [
    { _id: string; number: number; lat: number; lng: number; qr_code: number }
  ];
}

interface CoursesProps {
  name: string;
  admin: string;
  lat: number;
  lng: number;
}

export default function Main() {
  const token = useContext(TokenContext);

  const [courses, setCourses] = useState<CoursesProps[] | null>(null);

  const [requestError, setRequestError] = useState("");

  async function getData() {
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URI}/courses`,
          {
            headers: {
              "auth-token": token,
            },
          }
        );
        if (response.status == 200) {
          setCourses(
            response.data.map((course: APICourse) => {
              return {
                name: course.name,
                admin: course.admin.name,
                lat: course.checkpoints[0].lat,
                lng: course.checkpoints[0].lng,
              };
            })
          );
        } else {
          setRequestError(
            "Ha ocurrido un error inesperado cargando las carreras disponibles."
          );
        }
      } catch (error) {
        if (error.response.status == 401) {
          setRequestError(
            "No tienes permisos para acceder a este recurso. Pruebe a volver a iniciar sesión."
          );
          console.log(error);
        } else if (error.response.status == 404) {
        } else {
          setRequestError(
            "Ha ocurrido un error inesperado cargando las carreras disponibles."
          );
          console.log(error);
        }
      }
    }
  }

  useEffect(() => {
    if (token) {
      getData();
    }
  }, [token]);

  if (token == null) {
    return <LoadingBox />;
  } else if (token.length == 0) {
    return (
      <Box
        sx={{
          mt: { xs: 15, md: 20 },
          mb: 4,
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
            display: { xs: "none", md: "flex" },
            fontWeight: 700,
            letterSpacing: ".1rem",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          ¡Bienvenid@ a Orienteering.me!
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mt: 6,
            mb: 6,
            display: { xs: "flex", md: "none" },
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
          En Orienteering.me podrás crear carreras de orientación estableciendo
          puntos de control de forma sencilla directamente en un mapa, generando
          QRs para llevar el control de los participantes. Y si lo que buscas es
          participar, puedes buscar carreras en tu zona en nuestro buscador.
        </Typography>
        <Button
          variant="contained"
          href="/login"
          style={{
            marginBottom: "1rem",
            marginLeft: "20%",
            color: "white",
            fontWeight: 700,
            width: "60%",
            justifyContent: "center",
            textAlign: "center",
          }}
          color="primary"
        >
          Iniciar sesión
        </Button>
      </Box>
    );
  } else if (courses != null) {
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
        <ErrorAlert
          open={Boolean(requestError)}
          error={requestError}
          onClose={() => setRequestError("")}
        />
        <MainPageMap courses={courses} />
      </Container>
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
        <LoadingBox />
        <ErrorAlert
          open={Boolean(requestError)}
          error={requestError}
          onClose={() => setRequestError("")}
        />
      </Container>
    );
  }
}
