import { useContext, useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import LoadingBox from "../../components/LoadingBox";
import ForbiddenPage from "../../components/ForbiddenPage";
import { AuthContext, ErrorContext } from "../_app";
import { refreshTokens } from "../../hooks/refreshTokens";
import {
  CreatedCourseCard,
  CreatedCourseCardProps,
} from "../../components/CreatedCoursesCard";

export default function CreatedCourses() {
  const auth = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);

  const [courses, setCourses] = useState<CreatedCourseCardProps[] | null>(null);

  async function requestCoursesData() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/users/courses`,
        {
          headers: {
            "Access-Token": auth.accessToken,
          },
        }
      );
      if (response.status == 200) {
        console.log(response.data.courses);
        setCourses(
          response.data.courses.map(
            (course: {
              name: string;
              checkpoints: [{ lat: number; lng: number }];
            }) => {
              return {
                name: course.name,
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
      <ForbiddenPage
        title="No has iniciado sesión o no tienes permiso"
        message="Quizás la sesión ha caducado. Prueba a iniciar sesión de nuevo."
        button_href="/login"
        button_text="Iniciar sesión"
      />
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
        <Box
          sx={{
            mt: { xs: 12, md: 15 },
            mb: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            padding: "2% 5%",
            backgroundColor: "#ffffff",
            width: { xs: "90%", md: "80%" },
            borderRadius: "25px",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              Orienteering.me
            </Link>
            <Typography color="text.primary">Carreras creadas</Typography>
          </Breadcrumbs>
          <Typography
            variant="h4"
            sx={{
              mt: 2,
              mb: 2,
              display: "flex",
              fontWeight: 700,
            }}
          >
            Carreras creadas
          </Typography>
          <Grid
            container
            rowSpacing={3}
            columnSpacing={3}
            justifyContent="center"
            mb={3}
          >
            {courses.map(function (course, index) {
              return (
                <Grid item xs={12} sm={6} md={4}>
                  <CreatedCourseCard
                    name={course.name}
                    lat={course.lat}
                    lng={course.lng}
                    key={index}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    );
  } else {
    return <LoadingBox />;
  }
}
