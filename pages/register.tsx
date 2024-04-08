import { useState } from "react";
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

import ResponsiveAppBar from "../components/ResponsiveAppBar";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

  const [passwordScore, setPasswordScore] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
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

  function handleSubmit(event: any) {
    event.preventDefault();
    setEmailError(
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    );
    setPasswordError(
      !password.match(
        /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,}$/
      ) || passwordScore < 2
    );
    setRepeatedPasswordError(password != repeatedPassword);

    const user = {
      email: email,
      name: name,
      phone_number: phone_number,
      password: password,
    };
  }

  return (
    <Container maxWidth="lg" style={{ width: "100%" }}>
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveAppBar></ResponsiveAppBar>
        <form onSubmit={handleSubmit} action="login" style={{ width: "90%" }}>
          <Box
            sx={{
              my: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "left",
              padding: "2% 5%",
              backgroundColor: "#ffffff",
              width: "100%",
              borderRadius: "25px",
            }}
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
              Regístrate
            </Typography>
            <Typography
              noWrap
              sx={{
                mb: 2,
                display: "flex",
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
              error={emailError}
            />
            {emailError ? (
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
            <FormControl
              required
              variant="outlined"
              margin="normal"
              error={passwordError}
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
            {passwordError ? (
              <Alert
                variant="filled"
                severity="error"
                style={{ marginBottom: 5 }}
              >
                La contraseña debe ser fuerte como mínimo y contener al menos
                una minúscula, una mayúscula y un número.
              </Alert>
            ) : (
              <></>
            )}
            <FormControl
              required
              variant="outlined"
              margin="normal"
              error={repeatedPasswordError}
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
              style={{ marginTop: 15, marginBottom: 5, color: "white" }}
            >
              Crear cuenta
            </Button>
          </Box>
        </form>
      </Box>
      Photo by <a href="https://martinvorel.com/">Martin Vorel</a>
    </Container>
  );
}
