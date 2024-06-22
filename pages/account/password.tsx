import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import axios from "axios";
import bcrypt from "bcryptjs";
import Link from "next/link";
import LoadingBox from "../../components/LoadingBox";
import ForbiddenPage from "../../components/ForbiddenPage";
import { AuthContext, ErrorContext } from "../_app";
import { useRouter } from "next/router";
import PasswordStrengthBar from "react-password-strength-bar";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { refreshTokens } from "../../hooks/refreshTokens";

export default function ChangePassword() {
  const auth = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);
  const router = useRouter();

  const [newPasswordScore, setNewPasswordScore] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [repeatedNewPassword, setRepeatedNewPassword] = useState("");

  const [wrongNewPasswordFormat, setWrongNewPasswordFormat] = useState(false);
  const [repeatedNewPasswordError, setRepeatedNewPasswordError] =
    useState(false);

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

  const handleMouseDownNewPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickShowRepeatNewPassword = () =>
    setShowRepeatNewPassword((show) => !show);

  const handleMouseDownRepeatNewPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  async function requestPatchPassword(event: any) {
    event.preventDefault();
    const wrongNewPasswordFormat = newPasswordScore < 2;
    setWrongNewPasswordFormat(wrongNewPasswordFormat);
    const repeatedNewPasswordError = newPassword != repeatedNewPassword;
    setRepeatedNewPasswordError(repeatedNewPasswordError);

    if (!wrongNewPasswordFormat && !repeatedNewPasswordError) {
      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URI}/users`,
          {
            password: hashedPassword,
          },
          {
            headers: {
              "Access-Token": auth.accessToken,
            },
          }
        );
        if (response.status == 200) {
          alert("La contraseña se ha actualizado correctamente.");
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

  useEffect(() => {}, [auth]);

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
  } else if (newPassword != null) {
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
            mt: { xs: 15, md: 20 },
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
            <Typography color="text.primary">Cambiar contraseña</Typography>
          </Breadcrumbs>
          <form
            onSubmit={(event) => {
              requestPatchPassword(event).catch(() => {
                refreshTokens(auth, errorContext);
              });
            }}
            style={{ width: "100%" }}
          >
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
              Cambiar contraseña
            </Typography>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mt: 2,
                display: "flex",
                fontWeight: 500,
              }}
            >
              Nueva contraseña
            </Typography>
            <FormControl
              required
              variant="outlined"
              margin="normal"
              error={wrongNewPasswordFormat}
              sx={{ width: "100%" }}
            >
              <InputLabel htmlFor="password-input">Contraseña</InputLabel>
              <OutlinedInput
                id="password-input"
                label="Contraseña"
                onChange={(e) => setNewPassword(e.target.value)}
                type={showNewPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Cambia la visibilidad de la contraseña"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownNewPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <PasswordStrengthBar
              password={newPassword}
              scoreWords={[
                "Muy débil",
                "Débil",
                "Fuerte",
                "Muy fuerte",
                "Ideal",
              ]}
              minLength={0}
              onChangeScore={(score) => setNewPasswordScore(score)}
            />
            {wrongNewPasswordFormat ? (
              <Alert
                variant="filled"
                severity="error"
                style={{ marginBottom: 5 }}
              >
                La contraseña debe tener una puntuación de fuerte como mínimo.
              </Alert>
            ) : (
              <></>
            )}
            <Typography
              variant="h6"
              noWrap
              sx={{
                display: "flex",
                fontWeight: 500,
              }}
            >
              Repetir nueva contraseña
            </Typography>
            <FormControl
              required
              variant="outlined"
              margin="normal"
              error={repeatedNewPasswordError}
              sx={{ width: "100%" }}
            >
              <InputLabel htmlFor="repeat-password-input">
                Repetir contraseña
              </InputLabel>
              <OutlinedInput
                id="repeat-password-input"
                label="Repetir contraseña"
                onChange={(e) => setRepeatedNewPassword(e.target.value)}
                type={showRepeatNewPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Cambia la visibilidad de la contraseña"
                      onClick={handleClickShowRepeatNewPassword}
                      onMouseDown={handleMouseDownRepeatNewPassword}
                      edge="end"
                    >
                      {showRepeatNewPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {repeatedNewPasswordError ? (
              <Alert
                variant="filled"
                severity="error"
                style={{ marginBottom: 5 }}
              >
                Las contraseñas no coinciden.
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
