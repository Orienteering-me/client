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
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PasswordStrengthBar from "react-password-strength-bar";
import { useRouter } from "next/router";
import axios from "axios";
import bcrypt from "bcryptjs";
import LoadingBox from "../components/LoadingBox";
import { AuthContext, ErrorContext } from "./_app";

export default function Register() {
  const auth = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);
  const router = useRouter();

  const [userData, setUserData] = useState({
    email: "",
    name: "",
    phone_number: "",
    password: "",
  });
  const [repeatedPassword, setRepeatedPassword] = useState("");

  const [passwordScore, setPasswordScore] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [wrongEmailFormat, setWrongEmailFormat] = useState(false);
  const [wrongPhoneFormat, setWrongPhoneFormat] = useState(false);
  const [wrongPasswordFormat, setWrongPasswordFormat] = useState(false);
  const [repeatedPasswordError, setRepeatedPasswordError] = useState(false);

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

  async function registerAccount(event: any) {
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
    const wrongPasswordFormat = passwordScore < 2;
    setWrongPasswordFormat(wrongPasswordFormat);
    const repeatedPasswordError = userData.password != repeatedPassword;
    setRepeatedPasswordError(repeatedPasswordError);

    if (
      !wrongEmailFormat &&
      !wrongPhoneFormat &&
      !wrongPasswordFormat &&
      !repeatedPasswordError
    ) {
      try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URI}/register`,
          {
            email: userData.email,
            name: userData.name,
            phone_number: userData.phone_number,
            password: hashedPassword,
          }
        );

        if (response.status == 201) {
          alert("Te has registrado correctamente.");
          router.push("/login");
        }
      } catch (error) {
        console.log(error);
        if (error.response.status == 409) {
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
    if (auth.refreshToken != "" && auth.refreshToken != null) {
      router.push("/");
    }
  }, [auth]);

  if (auth.refreshToken == null) {
    return <LoadingBox />;
  } else if (auth.refreshToken == "") {
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
            width: { xs: "90%", md: "50%" },
            borderRadius: "25px",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              Orienteering.me
            </Link>
            <Typography color="text.primary">Regístrate</Typography>
          </Breadcrumbs>
          <form onSubmit={registerAccount} style={{ width: "100%" }}>
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
              onChange={(e) =>
                setUserData({
                  email: e.target.value,
                  name: userData.name,
                  phone_number: userData.phone_number,
                  password: userData.password,
                })
              }
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
              onChange={(e) =>
                setUserData({
                  email: userData.email,
                  name: e.target.value,
                  phone_number: userData.phone_number,
                  password: userData.password,
                })
              }
            />
            <TextField
              fullWidth
              id="phone-input"
              label="Teléfono"
              placeholder="+34 123456789"
              variant="outlined"
              margin="normal"
              onChange={(e) =>
                setUserData({
                  email: userData.email,
                  name: userData.name,
                  phone_number: e.target.value,
                  password: userData.password,
                })
              }
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
                onChange={(e) =>
                  setUserData({
                    email: userData.email,
                    name: userData.name,
                    phone_number: userData.phone_number,
                    password: e.target.value,
                  })
                }
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
              password={userData.password}
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
                      {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
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
  } else {
    return <LoadingBox />;
  }
}
