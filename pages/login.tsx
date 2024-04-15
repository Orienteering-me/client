import { useState } from "react";
import { useRouter } from "next/router";
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

import ResponsiveAppBar from "../components/ResponsiveAppBar";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  async function handleSubmit(event: any) {
    event.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:3000/login", {
        email: email,
        password: password,
      });

      console.log(response.data);
      if (response.status == 200) {
        localStorage.setItem("jwt-token", response.data.token);
        setEmail("");
        setPassword("");
        router.push(".");
      } else {
        alert(
          "Ha ocurrido un error inesperado. Por favor, inténtelo más tarde."
        );
      }
    } catch (error) {
      if (error.response.status == 404) {
        alert("La cuneta introducida no existe.");
      } else {
        alert(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
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
              Inicia sesión
            </Typography>
            <Typography
              noWrap
              sx={{
                mb: 2,
                display: "flex",
                fontWeight: 500,
              }}
            >
              ¿Aún no tienes una cuenta?&nbsp;
              <Link href="register">Regístrate aquí.</Link>
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
            />
            <FormControl required variant="outlined" margin="normal">
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
            <Button
              type="submit"
              variant="contained"
              style={{
                marginTop: 15,
                marginBottom: 5,
                color: "white",
                fontWeight: 700,
              }}
            >
              Iniciar sesión
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
