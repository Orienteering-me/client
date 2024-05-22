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
import { TokenContext } from "../_app";
import ErrorAlert from "../../components/ErrorAlert";
import { useRouter } from "next/router";

export default function Account() {
  const token = useContext(TokenContext);
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [userData, setUserData] = useState({
    email: "Cargando...",
    name: "Cargando...",
    phone_number: "Cargando...",
  });

  const [requestError, setRequestError] = useState("");

  async function getUserData() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/users`,
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      if (response.status == 200) {
        setUserData(response.data);
      } else {
        setRequestError(
          "Ha ocurrido un error inesperado. Por favor, inténtelo más tarde."
        );
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 401) {
        setRequestError("No tienes permisos para acceder a este recurso.");
      } else if (error.response.status == 404) {
        setRequestError("La cuenta actual no existe.");
      } else {
        setRequestError(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  }

  const deleteUser = async () => {
    setOpenDeleteDialog(false);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URI}/users`,
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      if (response.status == 200) {
        alert("La cuenta ha sido eliminada correctamente.");
        localStorage.removeItem("orienteering-me-token");
        router.push("/");
      } else {
        setRequestError(
          "Ha ocurrido un error inesperado. Por favor, inténtelo más tarde."
        );
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 401) {
        setRequestError("No tienes permisos para realizar esta acción.");
      } else if (error.response.status == 404) {
        setRequestError("La cuenta actual no existe.");
      } else {
        setRequestError(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  };

  useEffect(() => {
    if (token) {
      getUserData();
      setLoaded(true);
    } else {
      setLoaded(true);
    }
  }, [token]);

  if (!loaded) {
    return <LoadingBox />;
  }
  if (!token) {
    return (
      <ForbiddenPage
        title="No has iniciado sesión"
        message="Inicia sesión para poder ver esta página"
        button_href="/login"
        button_text="Iniciar sesión"
      />
    );
  }
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
          noWrap
          sx={{
            mt: 2,
            mb: 2,
            display: "flex",
            fontWeight: 700,
            letterSpacing: ".1rem",
          }}
        >
          Mi cuenta
        </Typography>
        <Typography
          variant="h6"
          noWrap
          sx={{
            mt: 2,
            display: "flex",
            fontWeight: 700,
          }}
        >
          Correo electrónico
        </Typography>
        <Typography
          noWrap
          sx={{
            mt: 1,
            mb: 2,
            display: "flex",
            fontWeight: 500,
          }}
        >
          {userData.email}
        </Typography>
        <Typography
          variant="h6"
          noWrap
          sx={{
            mt: 2,
            display: "flex",
            fontWeight: 700,
          }}
        >
          Nombre completo
        </Typography>
        <Typography
          noWrap
          sx={{
            mt: 1,
            mb: 2,
            display: "flex",
            fontWeight: 500,
          }}
        >
          {userData.name}
        </Typography>
        <Typography
          variant="h6"
          noWrap
          sx={{
            mt: 2,
            display: "flex",
            fontWeight: 700,
          }}
        >
          Teléfono
        </Typography>
        <Typography
          noWrap
          sx={{
            mt: 1,
            mb: 2,
            display: "flex",
            fontWeight: 500,
          }}
        >
          {userData.phone_number}
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
          href="/account/change_password"
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
              {"¿Está seguro de que quiere borrar su cuenta?"}
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
                onClick={deleteUser}
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
}
