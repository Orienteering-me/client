import { createContext, useContext, useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import axios from "axios";
import LoadingBox from "../../../components/LoadingBox";
import ForbiddenPage from "../../../components/ForbiddenPage";
import Link from "next/link";
import { UploadImageCard } from "../../../components/UploadImageCard";
import { AuthContext, ErrorContext } from "../../_app";
import { refreshTokens } from "../../../hooks/refreshTokens";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useRouter } from "next/router";

interface ImageStatus {
  valid: boolean | null;
  msg: string;
}

type ImagesStatusContextType = {
  imagesStatus: ImageStatus[];
  setImagesStatus: (imagesStatus: ImageStatus[]) => void;
};

export const ImagesStatusContext = createContext<ImagesStatusContextType>({
  imagesStatus: [],
  setImagesStatus: () => {},
});

export default function RunCourse({ course }: any) {
  const auth = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);
  const router = useRouter();

  const [uploadedTimes, setUploadedTimes] = useState<boolean[] | null>(null);
  const [imagesStatus, setImagesStatus] = useState<ImageStatus[]>([]);
  const [processedImagesNumber, setProcessedImagesNumber] = useState<number>(0);
  const [imagesToProcessNumber, setImagesToProcessNumber] = useState<number>(0);
  const [requestIsLoading, setRequestIsLoading] = useState<boolean>(false);

  const [images, setImages] = useState<File[]>([]);

  // Sends a request to the backend to check if the user must send some times
  async function requestUploadedTimes() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/times/uploaded?course=` + course,
        {
          headers: {
            "Access-Token": auth.accessToken,
          },
        }
      );

      if (response.status == 200) {
        if (response.data.is_admin) {
          router.push("/course/times?course=" + course);
          return;
        }
        const uploadedTimes = response.data.times.map((stat: any) => {
          return stat != null;
        });
        if (
          uploadedTimes.filter((value: any) => {
            return value;
          }).length == uploadedTimes.length
        ) {
          router.push("/course/times?course=" + course);
          return;
        }
        setUploadedTimes(uploadedTimes);
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

  async function loadImages(files: FileList) {
    const imageList: File[] = [];
    const imageStatusList: ImageStatus[] = [];
    for (let index = 0; index < files.length; index++) {
      const file: File | null = files.item(index);
      if (file) {
        const fileType = file["type"];
        const validImageTypes = ["image/jpeg", "image/png"];
        if (validImageTypes.includes(fileType)) {
          imageList.push(file);
          imageStatusList.push({ valid: null, msg: "" });
        } else {
          errorContext.setError(
            "Los formatos de imagen aceptados son JPEG y PNG."
          );
        }
      }
    }
    setImages(imageList);
    setImagesStatus(imageStatusList);
  }

  async function sendImages(event: any) {
    event.preventDefault();
    try {
      setImagesToProcessNumber(images.length);
      setRequestIsLoading(true);
      const newImagesStatus: ImageStatus[] = [...imagesStatus];
      const newUploadedStats: boolean[] = [...uploadedTimes!];
      for (let index = 0; index < images.length; index++) {
        try {
          const formData = new FormData();
          formData.append("image", images[index]);

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URI}/times?course=` + course,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                "Access-Token": auth.accessToken,
              },
            }
          );
          if (response.status == 201) {
            newImagesStatus[index] = {
              valid: true,
              msg: response.data.msg,
            };
            newUploadedStats[response.data.checkpoint] = true;
          }
        } catch (error) {
          if (error.response.status == 401) {
            throw Error("Permiso denegado.");
          } else {
            newImagesStatus[index] = {
              valid: false,
              msg: error.response.data.msg,
            };
          }
        } finally {
          setProcessedImagesNumber(index + 1);
        }
      }
      if (
        newUploadedStats.filter((value) => {
          return value;
        }).length == newUploadedStats.length
      ) {
        router.push("/course/times?course=" + course);
        return;
      }
      setImagesStatus(newImagesStatus);
      setUploadedTimes(newUploadedStats);
      setRequestIsLoading(false);
      setProcessedImagesNumber(0);
    } catch (error) {
      setRequestIsLoading(false);
      setProcessedImagesNumber(0);
      throw Error("Permiso denegado.");
    }
  }

  useEffect(() => {
    if (auth.refreshToken) {
      requestUploadedTimes().catch(() => {
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
  } else if (uploadedTimes != null) {
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
        <Modal
          open={requestIsLoading}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              mt: { xs: 12, md: 30 },
              mx: { xs: 2 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "left",
              padding: { xs: "5%", md: "2% 4%" },
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              verticalAlign: "center",
            }}
          >
            <Grid
              container
              rowSpacing={3}
              columnSpacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={2}>
                <CircularProgress color="primary" size="3rem" />
              </Grid>
              <Grid item xs={10}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Procesando imágenes...
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Se han procesado {processedImagesNumber} imágenes de{" "}
                  {imagesToProcessNumber}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Modal>
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
            <Link color="inherit" href={"/course/times?course=" + course}>
              Ver resultados
            </Link>
            <Typography color="text.primary">Subir resultados</Typography>
          </Breadcrumbs>
          <form
            onSubmit={(event) => {
              sendImages(event).catch(() => {
                refreshTokens(auth, errorContext);
              });
            }}
            style={{ width: "100%" }}
          >
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
              color="text.secondary"
              sx={{
                display: "flex",
                fontWeight: 700,
              }}
            >
              {course}
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
              color="text.secondary"
              sx={{
                fontWeight: 700,
              }}
            >
              * Ten cuidado de que el QR se pueda leer fácilmente y no haya más
              de un QR en la misma imagen.
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontWeight: 700,
              }}
            >
              * Los formatos admitidos son JPEG y PNG.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mt: 4,
                mb: 2,
                display: "flex",
                fontWeight: 700,
              }}
            >
              Puntos de control subidos
            </Typography>
            <List dense={true}>
              {uploadedTimes.map((uploadedStat, index) => {
                return (
                  <ListItem key={index + 1}>
                    <ListItemIcon>
                      {uploadedStat ? (
                        <CheckCircle style={{ color: "green" }} />
                      ) : (
                        <Cancel style={{ color: "red" }} />
                      )}
                    </ListItemIcon>
                    <ListItemText>
                      <Typography>{`Punto de control ${index + 1}`}</Typography>
                    </ListItemText>
                  </ListItem>
                );
              })}
            </List>
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
            <ImagesStatusContext.Provider
              value={{ imagesStatus, setImagesStatus }}
            >
              <Grid
                container
                rowSpacing={3}
                columnSpacing={3}
                justifyContent="center"
                mb={3}
              >
                {images.map(function (image, index) {
                  return (
                    <UploadImageCard
                      image={image}
                      valid={imagesStatus[index].valid}
                      msg={imagesStatus[index].msg}
                      key={index}
                    />
                  );
                })}
              </Grid>
            </ImagesStatusContext.Provider>
            <Button
              fullWidth
              variant="outlined"
              component="label"
              style={{
                marginTop: 10,
                fontWeight: 700,
              }}
            >
              Elegir imágenes
              <input
                type="file"
                hidden
                accept=".png, .jpg, .jpeg"
                multiple={true}
                onChange={(event) => {
                  loadImages(event.target!.files!);
                }}
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{
                marginTop: 5,
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
  const { course } = query;
  return { course };
};
