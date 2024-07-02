import { Box, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import LoadingBox from "../components/LoadingBox";
import { AuthContext, ErrorContext } from "./_app";
import { refreshTokens } from "../hooks/refreshTokens";
import { CoursesProps } from "../components/maps/MainPageMap";

const MainPageMap = dynamic(() => import("../components/maps/MainPageMap"), {
  ssr: false,
});

// Main page
export default function Main() {
  const auth = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);

  const [courses, setCourses] = useState<CoursesProps[] | null>(null);

  async function requestCoursesData() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/courses`,
        {
          headers: {
            "Access-Token": auth.accessToken,
          },
        }
      );
      if (response.status == 200) {
        setCourses(
          response.data.courses.map(
            (course: {
              name: string;
              admin: { name: string };
              checkpoints: [{ lat: number; lng: number }];
            }) => {
              return {
                name: course.name,
                admin: course.admin.name,
                lat: course.checkpoints[0].lat,
                lng: course.checkpoints[0].lng,
              };
            }
          )
        );
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 401) {
        throw Error("Permiso denegado.");
      } else if (error.response.status == 404) {
        setCourses([]);
      } else {
        errorContext.setError(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  }

  useEffect(() => {
    if (auth.refreshToken) {
      requestCoursesData().catch(() => {
        refreshTokens(auth, errorContext);
      });
    }
  }, [auth]);

  if (auth.refreshToken == null) {
    return <LoadingBox />;
  } else if (auth.refreshToken == "") {
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
          width: { xs: "90%", md: "50%" },
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
          QRs para llevar el control de los participantes. Y si lo que quieres
          es participar, puedes encontrar carreras en tu zona en nuestro
          buscador.
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
        <MainPageMap courses={courses} />
      </Container>
    );
  } else {
    return <LoadingBox />;
  }
}
