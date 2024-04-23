import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
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
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  async function login(event: any) {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/login`,
        {
          email: email,
          password: password,
        }
      );

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
      if (error.response.status == 401) {
        alert("La contraseña introducida es incorrecta.");
      }
      if (error.response.status == 404) {
        alert("La cuenta introducida no existe.");
      } else {
        alert(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    setToken(token!);
  }, []);

  if (token) {
    return (
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "left",
          padding: "2% 5%",
          backgroundColor: "#ffffff",
          width: "90%",
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
          Ya tiene una sesión iniciada
        </Typography>
        <Typography
          variant="h6"
          noWrap
          sx={{
            mt: 2,
            mb: 2,
            display: "flex",
            fontWeight: 500,
          }}
        >
          Para iniciar sesión con otra cuenta, primero cierra la sesión actual.
        </Typography>
        <Button
          variant="contained"
          href="/logout"
          style={{
            marginTop: 50,
            marginBottom: 5,
            marginLeft: "20%",
            color: "white",
            fontWeight: 700,
            width: "60%",
          }}
          color="primary"
        >
          Cerrar sesión
        </Button>
      </Box>
    );
  }

  return (
    <form onSubmit={login} action="login" style={{ width: "90%" }}>
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
            marginTop: 25,
            marginBottom: 10,
            color: "white",
            fontWeight: 700,
          }}
        >
          Iniciar sesión
        </Button>
      </Box>
    </form>
  );
}
