import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PasswordStrengthBar from "react-password-strength-bar";
import { useRouter } from "next/router";
import axios from "axios";
import bcrypt from "bcryptjs";
import ErrorAlert from "../components/ErrorAlert";
import LoadingBox from "../components/LoadingBox";
import { TokenContext } from "./_app";
import ForbiddenPage from "../components/ForbiddenPage";

export default function Register() {
  const token = useContext(TokenContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

  const [loaded, setLoaded] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [wrongEmailFormat, setWrongEmailFormat] = useState(false);
  const [wrongPhoneFormat, setWrongPhoneFormat] = useState(false);
  const [wrongPasswordFormat, setWrongPasswordFormat] = useState(false);
  const [repeatedPasswordError, setRepeatedPasswordError] = useState(false);
  const [errorRetrievingData, setErrorRetrievingData] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickShowRepeatPassword = () =>
    setShowRepeatPassword((show) => !show);

  const handleMouseDownRepeatPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  async function registerAccount(this: any, event: any) {
    event.preventDefault();
    const wrongEmailFormat = !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    setWrongEmailFormat(wrongEmailFormat);
    const wrongPhoneFormat =
      !phone_number.replace(/[\s()+\-\.]|ext/gi, "").match(/^\d{5,}$/) &&
      phone_number.length != 0;
    setWrongPhoneFormat(wrongPhoneFormat);
    const wrongPasswordFormat = passwordScore < 2;
    setWrongPasswordFormat(wrongPasswordFormat);
    const repeatedPasswordError = password != repeatedPassword;
    setRepeatedPasswordError(repeatedPasswordError);

    if (
      !wrongEmailFormat &&
      !wrongPhoneFormat &&
      !wrongPasswordFormat &&
      !repeatedPasswordError
    ) {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URI}/users`,
          {
            email: email,
            name: name,
            phone_number: phone_number,
            password: hashedPassword,
          }
        );

        if (response.status == 201) {
          alert("Te has registrado correctamente.");
          setEmail("");
          setName("");
          setPhoneNumber("");
          setPassword("");
          setRepeatedPassword("");
          router.push("/login");
        } else {
          setErrorRetrievingData(
            "Ha ocurrido un error inesperado. Por favor, inténtelo más tarde."
          );
        }
      } catch (error) {
        if (error.response.status == 409) {
          setErrorRetrievingData(
            "Ya existe una cuenta registrada con esta dirección de correo."
          );
          console.log(error);
        } else {
          setErrorRetrievingData(
            "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
          );
          console.log(error);
        }
      }
    }
  }

  useEffect(() => {
    setLoaded(true);
  }, [token]);

  if (!loaded) {
    return <LoadingBox />;
  } else {
    if (token) {
      return (
        <ForbiddenPage
          title="Ya tienes una sesión iniciada"
          message="Para registrar una nueva cuenta, primero cierra la sesión actual"
          button_href="/logout"
          button_text="Cerrar sesión"
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
          <ErrorAlert
            open={Boolean(errorRetrievingData)}
            error={errorRetrievingData}
            onClose={() => setErrorRetrievingData("")}
          />
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
              width: { xs: "90%", md: "50%" },
              borderRadius: "25px",
            }}
          >
            <form
              onSubmit={registerAccount}
              action="login"
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
                Regístrate
              </Typography>
              <Typography
                sx={{
                  mb: 2,
                  fontWeight: 500,
                }}
              >
                ¿Ya tienes una cuenta?&nbsp;
                <Link href="login">Inicia sesión aquí.</Link>
              </Typography>
              <TextField
                required
                fullWidth
                id="email-input"
                label="Correo electrónico"
                placeholder="example@gmail.com"
                variant="outlined"
                margin="normal"
                onChange={(e) => setEmail(e.target.value)}
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
              <TextField
                required
                fullWidth
                id="name-input"
                label="Nombre completo"
                variant="outlined"
                margin="normal"
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                fullWidth
                id="phone-input"
                label="Teléfono"
                placeholder="+34 123456789"
                variant="outlined"
                margin="normal"
                onChange={(e) => setPhoneNumber(e.target.value)}
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
              <FormControl
                required
                variant="outlined"
                margin="normal"
                error={wrongPasswordFormat}
                sx={{ width: "100%" }}
              >
                <InputLabel htmlFor="password-input">Contraseña</InputLabel>
                <OutlinedInput
                  id="password-input"
                  label="Contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Cambia la visibilidad de la contraseña"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <PasswordStrengthBar
                password={password}
                scoreWords={[
                  "Muy débil",
                  "Débil",
                  "Fuerte",
                  "Muy fuerte",
                  "Ideal",
                ]}
                minLength={0}
                onChangeScore={(score, feedback) => setPasswordScore(score)}
              />
              {wrongPasswordFormat ? (
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
              <FormControl
                required
                variant="outlined"
                margin="normal"
                error={repeatedPasswordError}
                sx={{ width: "100%" }}
              >
                <InputLabel htmlFor="repeat-password-input">
                  Repetir contraseña
                </InputLabel>
                <OutlinedInput
                  id="repeat-password-input"
                  label="Repetir contraseña"
                  onChange={(e) => setRepeatedPassword(e.target.value)}
                  type={showRepeatPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Cambia la visibilidad de la contraseña"
                        onClick={handleClickShowRepeatPassword}
                        onMouseDown={handleMouseDownRepeatPassword}
                        edge="end"
                      >
                        {showRepeatPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {repeatedPasswordError ? (
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
                  marginTop: 25,
                  marginBottom: 10,
                  color: "white",
                  fontWeight: 700,
                }}
              >
                Crear cuenta
              </Button>
            </form>
          </Box>
        </Container>
      );
    }
  }
}
