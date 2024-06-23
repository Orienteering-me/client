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
import Link from "next/link";
import LoadingBox from "../../components/LoadingBox";
import ForbiddenPage from "../../components/ForbiddenPage";
import { AuthContext, ErrorContext } from "../_app";
import { useRouter } from "next/router";
import { refreshTokens } from "../../hooks/refreshTokens";

interface UserData {
  email: string;
  name: string;
  phone_number: string;
}

// Account page
export default function Account() {
  const auth = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);

  // Sends a request to the backend to get the user data
  async function requestUserData() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/users`,
        {
          headers: {
            "Access-Token": auth.accessToken,
          },
        }
      );
      if (response.status == 200) {
        setUserData(response.data);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 401) {
        throw Error("Permiso denegado.");
      } else if (error.response.status == 404) {
        errorContext.setError("La cuenta actual no existe.");
      } else {
        errorContext.setError(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  }

  // Sends a request to the backend to delete the user
  async function requestDeleteUser() {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URI}/users`,
        {
          headers: {
            "Access-Token": auth.accessToken,
          },
        }
      );
      if (response.status == 200) {
        alert("La cuenta ha sido eliminada correctamente.");
        sessionStorage.removeItem("orienteering-me-access-token");
        localStorage.removeItem("orienteering-me-refresh-token");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 401) {
        throw Error("Permiso denegado.");
      } else if (error.response.status == 404) {
        errorContext.setError("La cuenta actual no existe.");
      } else {
        errorContext.setError(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  }

  useEffect(() => {
    if (auth.refreshToken) {
      requestUserData().catch(() => {
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
  } else if (userData != null) {
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
            mt: { xs: 12, md: 20 },
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
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              Orienteering.me
            </Link>
            <Typography color="text.primary">Mi cuenta</Typography>
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
            Mi cuenta
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              display: "flex",
              fontWeight: 500,
            }}
          >
            Correo electrónico
          </Typography>
          <Typography
            sx={{
              mt: 1,
              mb: 2,
              display: "flex",
              fontWeight: 500,
            }}
            color="text.secondary"
          >
            {userData.email}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              display: "flex",
              fontWeight: 500,
            }}
          >
            Nombre completo
          </Typography>
          <Typography
            sx={{
              mt: 1,
              mb: 2,
              display: "flex",
              fontWeight: 500,
            }}
            color="text.secondary"
          >
            {userData.name}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              display: "flex",
              fontWeight: 500,
            }}
          >
            Teléfono
          </Typography>
          <Typography
            sx={{
              mt: 1,
              mb: 2,
              display: "flex",
              fontWeight: 500,
            }}
            color="text.secondary"
          >
            {Boolean(userData.phone_number) ? userData.phone_number : "-"}
          </Typography>
          <Button
            variant="outlined"
            style={{
              marginTop: 15,
              fontWeight: 700,
            }}
            href="/account/edit"
          >
            Editar cuenta
          </Button>
          <Button
            variant="outlined"
            style={{
              marginTop: 5,
              fontWeight: 700,
            }}
            href="/account/password"
          >
            Cambiar contraseña
          </Button>
          <Fragment>
            <Button
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
              Borrar cuenta
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
                {"¿Estás seguro de que quieres borrar la cuenta?"}
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
                    requestDeleteUser().catch(() => {
                      refreshTokens(auth, errorContext);
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
        </Box>
      </Container>
    );
  } else {
    return <LoadingBox />;
  }
}
