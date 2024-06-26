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
import { AuthContext, ErrorContext } from "../_app";
import { useRouter } from "next/router";
import { refreshTokens } from "../../hooks/refreshTokens";

interface UserData {
  email: string;
  name: string;
  phone_number: string;
}

export default function EditAccount() {
  const auth = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);

  const [wrongEmailFormat, setWrongEmailFormat] = useState(false);
  const [wrongPhoneFormat, setWrongPhoneFormat] = useState(false);

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

  async function requestPatchUser(event: any) {
    event.preventDefault();
    const wrongEmailFormat = !userData!.email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    setWrongEmailFormat(wrongEmailFormat);
    const wrongPhoneFormat =
      !userData!.phone_number
        .replace(/[\s()+\-\.]|ext/gi, "")
        .match(/^\d{5,}$/) && userData!.phone_number.length != 0;
    setWrongPhoneFormat(wrongPhoneFormat);

    if (!wrongEmailFormat && !wrongPhoneFormat) {
      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URI}/users`,
          userData,
          {
            headers: {
              "Access-Token": auth.accessToken,
            },
          }
        );
        if (response.status == 200) {
          auth.setRefreshToken(response.data.refresh_token);
          localStorage.setItem(
            "orienteering-me-refresh-token",
            response.data.refresh_token
          );
          auth.setAccessToken(response.data.access_token);
          sessionStorage.setItem(
            "orienteering-me-access-token",
            response.data.access_token
          );
          alert("La información de la cuenta se ha actualizado correctamente.");
          router.push("/account");
        }
      } catch (error) {
        console.log(error);
        if (error.response.status == 401) {
          throw Error("Permiso denegado.");
        } else if (error.response.status == 409) {
          errorContext.setError(
            "Ya existe una cuenta registrada con esta dirección de correo."
          );
        } else {
          errorContext.setError(
            "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
          );
        }
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
            <Link color="inherit" href="/account">
              Mi cuenta
            </Link>
            <Typography color="text.primary">Editar cuenta</Typography>
          </Breadcrumbs>
          <form
            onSubmit={(event) => {
              requestPatchUser(event).catch(() => {
                refreshTokens(auth, errorContext);
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
              }}
            >
              Editar cuenta
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
              sx={{
                mt: 2,
                display: "flex",
                fontWeight: 500,
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
              sx={{
                mt: 2,
                display: "flex",
                fontWeight: 500,
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
                marginBottom: 10,
              }}
              href="/account"
            >
              Cancelar
            </Button>
          </form>
        </Box>
      </Container>
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
        <LoadingBox />
      </Container>
    );
  }
}
