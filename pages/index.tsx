import { Box, Button, Container, Typography } from "@mui/material";

export default function Home() {
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
        width: "80%",
        borderRadius: "25px",
      }}
    >
      <Typography
        variant="h4"
        noWrap
        sx={{
          mt: 6,
          mb: 8,
          display: "flex",
          fontWeight: 700,
          letterSpacing: ".1rem",
          justifyContent: "center",
        }}
      >
        ¡Bienvenid@ a Orienteering.me!
      </Typography>
      <Typography
        variant="h6"
        sx={{
          mb: 4,
          display: "flex",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        En Orienteering.me podrás crear carreras de orientación estableciendo
        puntos de control de forma sencilla directamente en un mapa, generando
        QRs para llevar el control de los participantes. Y si lo que buscas es
        participar, puedes buscar carreras en tu zona en nuestro buscador.
      </Typography>
      <Button
        variant="contained"
        href="/login"
        style={{
          marginBottom: 10,
          marginLeft: "20%",
          color: "white",
          fontWeight: 700,
          width: "60%",
        }}
        color="primary"
      >
        Inicia sesión
      </Button>
    </Box>
  );
}
