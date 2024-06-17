import { createContext, useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import LoadingBox from "../../components/LoadingBox";
import ForbiddenPage from "../../components/ForbiddenPage";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AuthContext, ErrorContext } from "../_app";
import { refreshTokens } from "../../hooks/refreshTokens";

const CreateCourseMap = dynamic(
  () => import("../../components/maps/CreateCourseMap"),
  {
    ssr: false,
  }
);

interface Checkpoint {
  course: String;
  number: number;
  lat: number;
  lng: number;
}

type CreateCourseContextType = {
  courseName: string;
  checkpoints: Checkpoint[];
  setCheckpoints: (checkpoints: Checkpoint[]) => void;
};

export const CheckpointsContext = createContext<CreateCourseContextType>({
  courseName: "",
  checkpoints: [],
  setCheckpoints: () => {},
});

export default function CreateCourse() {
  const authContext = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);
  const router = useRouter();

  const [courseName, setCourseName] = useState("");
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);

  const [courseNameHasForbiddenCharacter, setCourseNameHasForbiddenCharacter] =
    useState(false);
  const [validNumberOfCheckpoints, setValidNumberOfCheckpoints] =
    useState(true);

  async function createCourse(event: any) {
    event.preventDefault();
    const courseNameHasForbiddenCharacter = courseName.includes("&");
    setCourseNameHasForbiddenCharacter(courseNameHasForbiddenCharacter);
    const validNumberOfCheckpoints = checkpoints.length >= 2;
    setValidNumberOfCheckpoints(validNumberOfCheckpoints);

    if (!courseNameHasForbiddenCharacter && validNumberOfCheckpoints) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URI}/courses`,
          {
            name: courseName,
            checkpoints: checkpoints,
          },
          {
            headers: {
              "Access-Token": authContext.accessToken,
            },
          }
        );
        if (response.status == 201) {
          router.push("/course?name=" + courseName);
        }
      } catch (error) {
        console.log(error);
        if (error.response.status == 401) {
          throw Error("Permiso denegado.");
        } else if (error.response.status == 409) {
          errorContext.setError(
            "Ya existe una carrera registrada con este nombre."
          );
        } else {
          errorContext.setError(
            "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
          );
        }
      }
    }
  }

  useEffect(() => {}, [authContext]);

  if (authContext.refreshToken == null) {
    return <LoadingBox />;
  } else if (authContext.refreshToken == "") {
    return (
      <ForbiddenPage
        title="No has iniciado sesión o no tienes permiso"
        message="Quizás la sesión ha caducado. Prueba a iniciar sesión de nuevo."
        button_href="/login"
        button_text="Iniciar sesión"
      />
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
            <Typography color="text.primary">Crear nueva carrera</Typography>
          </Breadcrumbs>
          <form
            onSubmit={(event) => {
              createCourse(event).catch(() => {
                refreshTokens(authContext, errorContext)
                  .then(() => {
                    createCourse(event);
                  })
                  .catch(() => {
                    sessionStorage.removeItem("orienteering-me-access-token");
                    localStorage.removeItem("orienteering-me-refresh-token");
                    authContext.setAccessToken("");
                    authContext.setRefreshToken("");
                  });
              });
            }}
            style={{ width: "100%" }}
          >
            <Typography
              variant="h4"
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
              onChange={(e) => setCourseName(e.target.value)}
            />
            {courseNameHasForbiddenCharacter ? (
              <Alert
                variant="filled"
                severity="error"
                style={{ marginBottom: 20 }}
              >
                El nombre de una carrera no puede contener el caracter "&".
              </Alert>
            ) : (
              <></>
            )}
            <Typography
              sx={{
                display: "flex",
                mt: 1,
                fontSize: 15,
              }}
            >
              * Para añadir un nuevo punto de control haga doble click sobre el
              mapa.
            </Typography>
            <Typography
              sx={{
                display: "flex",
                mb: 2,
                fontSize: 15,
              }}
            >
              * Para eliminar el último punto de control creado pulse Suprimir o
              Borrar.
            </Typography>
            <CheckpointsContext.Provider
              value={{ courseName, checkpoints, setCheckpoints }}
            >
              <CreateCourseMap />
            </CheckpointsContext.Provider>
            {!validNumberOfCheckpoints ? (
              <Alert
                variant="filled"
                severity="error"
                style={{ marginTop: 10 }}
              >
                Una carrera debe tener un mínimo de dos puntos de control.
              </Alert>
            ) : (
              <></>
            )}
            <Button
              variant="outlined"
              fullWidth
              style={{
                marginTop: 25,
                fontWeight: 700,
              }}
              onClick={() => {
                setCheckpoints(checkpoints.slice(0, -1));
              }}
            >
              Borrar último punto de control
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{
                marginTop: 5,
                color: "white",
                fontWeight: 700,
              }}
            >
              Crear recorrido
            </Button>
          </form>
        </Box>
      </Container>
    );
  }
}
