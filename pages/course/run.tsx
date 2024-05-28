import { createContext, useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import LoadingBox from "../../components/LoadingBox";
import ForbiddenPage from "../../components/ForbiddenPage";
import ErrorAlert from "../../components/ErrorAlert";
import Link from "next/link";
import { UploadImageCard } from "../../components/UploadImageCard";
import { AuthContext, ErrorContext } from "../_app";
import { refreshTokens } from "../../hooks/refreshTokens";

interface Checkpoint {
  _id: string;
  number: number;
  lat: number;
  lng: number;
  qr_code: string;
}

interface CourseData {
  name: string;
  admin: string;
  checkpoints: Checkpoint[];
}

interface Location {
  lat: number;
  lng: number;
}

type ImagesDataContextType = {
  qrCodes: (string | null)[];
  setQrCodes: (qrCodes: (string | null)[]) => void;
  locations: (Location | null)[];
  setLocations: (locations: (Location | null)[]) => void;
  dates: (Date | null)[];
  setDates: (dates: (Date | null)[]) => void;
};

export const ImagesDataContext = createContext<ImagesDataContextType>({
  qrCodes: [],
  setQrCodes: () => {},
  locations: [],
  setLocations: () => {},
  dates: [],
  setDates: () => {},
});

export default function RunCourse({ name }: any) {
  const authContext = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [qrCodes, setQrCodes] = useState<(string | null)[]>([]);
  const [locations, setLocations] = useState<(Location | null)[]>([]);
  const [dates, setDates] = useState<(Date | null)[]>([]);

  async function getData() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/courses?name=` + name,
        {
          headers: {
            "Access-Token": authContext.accessToken,
          },
        }
      );

      if (response.status == 200) {
        setCourseData({
          name: response.data.course.name,
          admin: response.data.course.admin.name,
          checkpoints: response.data.course.checkpoints,
        });
        const imagesDataInit = response.data.course.checkpoints.map(() => {
          return null;
        });
        setQrCodes(imagesDataInit);
        setDates(imagesDataInit);
        setLocations(imagesDataInit);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 401) {
        throw Error("Permiso denegado.");
      } else if (error.response.status == 404) {
        errorContext.setError("Esta carrera no existe.");
      } else {
        errorContext.setError(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  }

  async function sendQrs() {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/stats`,
        {
          course: courseData!.name,
          qrCodes: qrCodes,
        },
        {
          headers: {
            "Access-Token": authContext.accessToken,
          },
        }
      );

      if (response.status == 200) {
        setCourseData({
          name: response.data[0].name,
          admin: response.data[0].admin.name,
          checkpoints: response.data[0].checkpoints,
        });
        const qrCodesInit = response.data[0].checkpoints.map(() => {
          return null;
        });
        setQrCodes(qrCodesInit);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 401) {
        throw Error("Permiso denegado.");
      } else if (error.response.status == 404) {
        errorContext.setError("Esta carrera no existe.");
      } else {
        errorContext.setError(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  }

  useEffect(() => {
    if (authContext.refreshToken) {
      getData().catch(() => {
        refreshTokens(authContext, errorContext).catch(() => {
          sessionStorage.removeItem("orienteering-me-access-token");
          localStorage.removeItem("orienteering-me-refresh-token");
          authContext.setAccessToken("");
          authContext.setRefreshToken("");
        });
      });
    }
  }, [authContext]);

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
  } else if (courseData != null) {
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
            <Link color="inherit" href={"/course?name=" + courseData.name}>
              {courseData.name}
            </Link>
            <Typography color="text.primary">Subir resultados</Typography>
          </Breadcrumbs>
          <form onSubmit={sendQrs} style={{ width: "100%" }}>
            <Typography
              variant="h4"
              sx={{
                mt: 2,
                display: "flex",
                fontWeight: 700,
                letterSpacing: ".1rem",
              }}
            >
              Subir resultados
            </Typography>
            <Typography
              variant="h5"
              noWrap
              sx={{
                display: "flex",
                fontWeight: 700,
              }}
            >
              {courseData.name}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                mt: 2,
              }}
            >
              * Sube las fotos de los QR en cualquier orden para obtener tus
              resultados.
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontWeight: 700,
              }}
            >
              * Asegúrate de compartir la ubicación de la foto o no se podrá
              procesar el QR.
            </Typography>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mt: 4,
                mb: 2,
                display: "flex",
                fontWeight: 700,
              }}
            >
              Subir imágenes
            </Typography>
            <ImagesDataContext.Provider
              value={{
                qrCodes,
                setQrCodes,
                locations,
                setLocations,
                dates,
                setDates,
              }}
            >
              <Grid
                container
                rowSpacing={3}
                columnSpacing={3}
                justifyContent="center"
                mb={3}
              >
                {courseData.checkpoints.map((checkpoint, index) => {
                  return <UploadImageCard index={index} key={index} />;
                })}
              </Grid>
            </ImagesDataContext.Provider>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{
                marginBottom: 10,
                color: "white",
                fontWeight: 700,
              }}
            >
              Subir resultados
            </Button>
          </form>
        </Box>
      </Container>
    );
  } else {
    return <LoadingBox />;
  }
}

RunCourse.getInitialProps = async ({ query }: any) => {
  const { name } = query;
  return { name };
};
