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
import dynamic from "next/dynamic";
import ForbiddenPage from "../../components/ForbiddenPage";
import LoadingBox from "../../components/LoadingBox";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext, ErrorContext } from "../_app";
import { refreshTokens } from "../../hooks/refreshTokens";

const ViewCourseMap = dynamic(
  () => import("../../components/maps/ViewCourseMap"),
  {
    ssr: false,
  }
);

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

export default function Course({ name }: any) {
  const authContext = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);
  const router = useRouter();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [userIsAdmin, setUserIsAdmin] = useState<boolean | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);

  async function getCourseData() {
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
        setUserIsAdmin(response.data.is_admin);
        setCourseData({
          name: response.data.course.name,
          admin: response.data.course.admin.name,
          checkpoints: response.data.course.checkpoints,
        });
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
        `${process.env.NEXT_PUBLIC_API_URI}/courses?name=` + courseData!.name,
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
      getCourseData().catch(() => {
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
  } else if (courseData != null && userIsAdmin != null) {
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
            <Typography color="text.primary">{courseData.name}</Typography>
          </Breadcrumbs>
          <Typography
            variant="h4"
            noWrap
            sx={{
              mt: 2,
              display: "flex",
              fontWeight: 700,
              letterSpacing: ".1rem",
            }}
          >
            {courseData.name}
          </Typography>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mt: 2,
              display: "flex",
              fontWeight: 700,
              letterSpacing: ".1rem",
            }}
          >
            Creador
          </Typography>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mb: 2,
              display: "flex",
            }}
          >
            {courseData.admin}
          </Typography>
          <ViewCourseMap
            course_name={name}
            checkpoints={courseData.checkpoints.map(
              (checkpoint: Checkpoint) => {
                return {
                  number: checkpoint.number,
                  lat: checkpoint.lat,
                  lng: checkpoint.lng,
                  qr_code: checkpoint.qr_code,
                };
              }
            )}
            auth={userIsAdmin}
          />
          <Button
            variant="outlined"
            style={{
              marginTop: 20,
              fontWeight: 700,
            }}
            href={"/course/results?course=" + name}
          >
            Ver resultados
          </Button>
          {userIsAdmin ? (
            <div>
              <Button
                fullWidth
                variant="outlined"
                style={{
                  marginTop: 5,
                  fontWeight: 700,
                }}
                href={"/course/edit?name=" + name}
              >
                Editar carrera
              </Button>
              <Fragment>
                <Button
                  fullWidth
                  variant="contained"
                  style={{
                    marginTop: 5,
                    color: "white",
                    backgroundColor: "red",
                    fontWeight: 700,
                  }}
                  onClick={() => {
                    setOpenDeleteDialog(true);
                  }}
                >
                  Borrar carrera
                </Button>
                <Dialog
                  open={openDeleteDialog}
                  onClose={() => {
                    setOpenDeleteDialog(false);
                  }}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    ¿Está seguro de que quiere borrar esta carrera?
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Esta acción no se puede deshacer
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="contained"
                      style={{
                        marginBottom: 5,
                        color: "white",
                        backgroundColor: "red",
                      }}
                      onClick={() => {
                        setOpenDeleteDialog(false);
                        deleteCourse().catch(() => {
                          refreshTokens(authContext, errorContext);
                        });
                      }}
                    >
                      Aceptar
                    </Button>
                    <Button
                      variant="outlined"
                      style={{
                        marginBottom: 5,
                      }}
                      onClick={() => {
                        setOpenDeleteDialog(false);
                      }}
                      autoFocus
                    >
                      Cancelar
                    </Button>
                  </DialogActions>
                </Dialog>
              </Fragment>
            </div>
          ) : (
            <></>
          )}
        </Box>
      </Container>
    );
  } else {
    return <LoadingBox />;
  }
}

Course.getInitialProps = async ({ query }: any) => {
  const { name } = query;
  return { name };
};
