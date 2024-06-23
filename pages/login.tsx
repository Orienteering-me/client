import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
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
import axios from "axios";
import LoadingBox from "../components/LoadingBox";
import { AuthContext, ErrorContext } from "./_app";

// Login page
export default function Login() {
  const auth = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // Sends a request to the backend to login
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
      // If the response status is OK saves the tokens
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
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 401) {
        errorContext.setError("La contraseña introducida es incorrecta.");
      } else {
        errorContext.setError(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  }

  // If there is a session open redirects the user to the main page
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
            mt: 20,
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
            <Typography color="text.primary">Login</Typography>
          </Breadcrumbs>
          <form onSubmit={login} style={{ width: "100%" }}>
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
              Inicia sesión
            </Typography>
            <Typography
              sx={{
                mb: 2,
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
            <FormControl
              required
              variant="outlined"
              margin="normal"
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
              Iniciar sesión
            </Button>
          </form>
        </Box>
      </Container>
    );
  } else {
    return <LoadingBox />;
  }
}
