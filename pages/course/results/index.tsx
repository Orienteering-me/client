import { Fragment, useContext, useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import axios from "axios";
import ForbiddenPage from "../../../components/ForbiddenPage";
import LoadingBox from "../../../components/LoadingBox";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext, ErrorContext } from "../../_app";
import { refreshTokens } from "../../../hooks/refreshTokens";
import ResultsTable from "../../../components/ResultsTable";

interface Result {
  course: string;
  user: string;
  time: number;
}

export default function Course({ course }: any) {
  const authContext = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);
  const router = useRouter();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [userIsAdmin, setUserIsAdmin] = useState<boolean | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);

  async function getRanking() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/results?course=` + course,
        {
          headers: {
            "Access-Token": authContext.accessToken,
          },
        }
      );
      if (response.status == 200) {
        console.log(response.data);
        setResults(response.data);
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

  async function deleteCourse() {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URI}/courses?name=` + course,
        {
          headers: {
            "Access-Token": authContext.accessToken,
          },
        }
      );

      if (response.status == 200) {
        alert("La carrera ha sido eliminada correctamente.");
        router.push("/");
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
      getRanking().catch(() => {
        refreshTokens(authContext, errorContext);
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
  } else if (results != null) {
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
            <Link color="inherit" href={"/course?name=" + course}>
              {course}
            </Link>
            <Typography color="text.primary">Ver resultados</Typography>
          </Breadcrumbs>
          <Typography
            variant="h4"
            sx={{
              mt: 2,
              display: "flex",
              fontWeight: 700,
              letterSpacing: ".1rem",
            }}
          >
            Ver resultados
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              display: "flex",
              fontWeight: 700,
            }}
          >
            {course}
          </Typography>
          <ResultsTable rows={results} sx={{ mt: 4 }} />
          {userIsAdmin ? (
            <Button
              variant="outlined"
              style={{
                marginTop: 25,
                fontWeight: 700,
              }}
              href={"/course/edit?name=" + course}
            >
              Editar carrera
            </Button>
          ) : (
            <Button
              variant="contained"
              style={{
                marginTop: 25,
                fontWeight: 700,
                color: "white",
              }}
              href={"/course/results/upload?course=" + course}
            >
              Subir resultados
            </Button>
          )}
        </Box>
      </Container>
    );
  } else {
    return <LoadingBox />;
  }
}

Course.getInitialProps = async ({ query }: any) => {
  const { course } = query;
  return { course };
};
