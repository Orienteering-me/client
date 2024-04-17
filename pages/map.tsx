import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const OpenStreetMap = dynamic(() => import("../components/OpenStreetMap"), {
  ssr: false,
});

export default function Map() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    setToken(token!);
  }, []);

  if (!token) {
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
          No has iniciado sesión
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
          Inicia sesión para poder ver esta página.
        </Typography>
        <Button
          variant="contained"
          href="/login"
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
          Iniciar sesión
        </Button>
      </Box>
    );
  }

  return <OpenStreetMap />;
}
