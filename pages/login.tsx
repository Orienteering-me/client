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
import ErrorAlert from "../components/ErrorAlert";
import { TokenContext } from "./_app";
import ForbiddenPage from "../components/ForbiddenPage";

export default function Login() {
  const token = useContext(TokenContext);
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [requestError, setRequestError] = useState("");

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

      if (response.status == 200) {
        localStorage.setItem("orienteering-me-token", response.data.token);
        router.push("/");
      } else {
        setRequestError(
          "Ha ocurrido un error inesperado. Por favor, inténtelo más tarde."
        );
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 401) {
        setRequestError("La contraseña introducida es incorrecta.");
      } else if (error.response.status == 404) {
        setRequestError("La cuenta introducida no existe.");
      } else {
        setRequestError(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  }

  useEffect(() => {
    setLoaded(true);
  }, [token]);

  if (!loaded) {
    return <LoadingBox />;
  }
  if (token) {
    return (
      <ForbiddenPage
        title="Ya tienes una sesión iniciada"
        message="Para iniciar sesión con otra cuenta, primero cierra la sesión actual"
        button_href="/logout"
        button_text="Cerrar sesión"
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
}
