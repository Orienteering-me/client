import { useContext, useEffect, useState } from "react";
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
import Link from "next/link";
import LoadingBox from "../../components/LoadingBox";
import ForbiddenPage from "../../components/ForbiddenPage";
import { TokenContext } from "../_app";
import { useRouter } from "next/router";
import ErrorAlert from "../../components/ErrorAlert";

// TODO Cambiar Contraseña

export default function Account() {
  const token = useContext(TokenContext);
  const router = useRouter();

  const [userData, setUserData] = useState({
    email: "",
    name: "",
    phone_number: "",
  });

  const [loaded, setLoaded] = useState(false);
  const [wrongEmailFormat, setWrongEmailFormat] = useState(false);
  const [wrongPhoneFormat, setWrongPhoneFormat] = useState(false);

  const [errorRetrievingData, setErrorRetrievingData] = useState("");

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
        setErrorRetrievingData(
          "Ha ocurrido un error inesperado. Por favor, inténtelo más tarde."
        );
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 401) {
        setErrorRetrievingData(
          "No tienes permisos para acceder a este recurso."
        );
      } else if (error.response.status == 404) {
        setErrorRetrievingData("La cuenta actual no existe.");
      } else {
        setErrorRetrievingData(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  }

  async function patchAccount(event: any) {
    event.preventDefault();
    const wrongEmailFormat = !userData.email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    setWrongEmailFormat(wrongEmailFormat);
    const wrongPhoneFormat =
      !userData.phone_number
        .replace(/[\s()+\-\.]|ext/gi, "")
        .match(/^\d{5,}$/) && userData.phone_number.length != 0;
    setWrongPhoneFormat(wrongPhoneFormat);

    if (!wrongEmailFormat && !wrongPhoneFormat) {
      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URI}/users`,
          userData,
          {
            headers: {
              "auth-token": token,
            },
          }
        );

        if (response.status == 200) {
          alert("La información de la cuenta se ha actualizado correctamente.");
          localStorage.setItem("orienteering-me-token", response.data.token);
          router.push("/account");
        } else {
          setErrorRetrievingData(
            "Ha ocurrido un error inesperado. Por favor, inténtelo más tarde."
          );
        }
      } catch (error) {
        console.log(error);
        if (error.response.status == 409) {
          setErrorRetrievingData(
            "Ya existe una cuenta registrada con esta dirección de correo."
          );
        } else {
          setErrorRetrievingData(
            "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
          );
        }
      }
    }
  }

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
        open={Boolean(errorRetrievingData)}
        error={errorRetrievingData}
        onClose={() => setErrorRetrievingData("")}
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
          <Link color="inherit" href="/account">
            Mi cuenta
          </Link>
          <Typography color="text.primary">Editar cuenta</Typography>
        </Breadcrumbs>
        <form onSubmit={patchAccount} style={{ width: "100%" }}>
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
            Editar cuenta
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
          <TextField
            required
            fullWidth
            id="email-input"
            placeholder="example@gmail.com"
            variant="outlined"
            margin="normal"
            onChange={(e) =>
              setUserData({
                email: e.target.value,
                name: userData.name,
                phone_number: userData.phone_number,
              })
            }
            value={userData.email}
            error={wrongEmailFormat}
          />
          {wrongEmailFormat ? (
            <Alert
              variant="filled"
              severity="error"
              style={{ marginBottom: 5 }}
            >
              Formato incorrecto.
            </Alert>
          ) : (
            <></>
          )}
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
          <TextField
            required
            fullWidth
            id="name-input"
            variant="outlined"
            margin="normal"
            onChange={(e) =>
              setUserData({
                email: userData.email,
                name: e.target.value,
                phone_number: userData.phone_number,
              })
            }
            value={userData.name}
          />
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
          <TextField
            fullWidth
            id="phone-input"
            placeholder="+34 123456789"
            variant="outlined"
            margin="normal"
            onChange={(e) =>
              setUserData({
                email: userData.email,
                name: userData.name,
                phone_number: e.target.value,
              })
            }
            value={userData.phone_number}
          />
          {wrongPhoneFormat ? (
            <Alert
              variant="filled"
              severity="error"
              style={{ marginBottom: 5 }}
            >
              Formato incorrecto.
            </Alert>
          ) : (
            <></>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{
              marginTop: 15,
              marginBottom: 10,
              color: "white",
              fontWeight: 700,
            }}
          >
            Confirmar
          </Button>
          <Button
            variant="outlined"
            fullWidth
            style={{
              fontWeight: 700,
            }}
            href="/account"
          >
            Cancelar
          </Button>
        </form>
      </Box>
    </Container>
  );
}
