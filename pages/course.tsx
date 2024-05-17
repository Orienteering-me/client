import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import DeleteCourseFormDialog from "../components/DeleteCourseFormDialog";
import dynamic from "next/dynamic";

const CourseStreetMap = dynamic(() => import("../components/CourseStreetMap"), {
  ssr: false,
});

interface CheckpointProps {
  _id: string;
  number: number;
  lat: number;
  lng: number;
  qr_code: string;
}

export default function Course({ name }) {
  const [token, setToken] = useState("");
  const [courseData, setCourseData] = useState({
    name: "Cargando...",
    admin: "Cargando...",
    checkpoints: [],
  });

  async function getData() {
    const token = localStorage.getItem("orienteering-me-token");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/courses?name=` + name,
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      if (response.status == 200) {
        setCourseData({
          name: response.data[0].name,
          admin: response.data[0].admin.name,
          checkpoints: response.data[0].checkpoints,
        });
      } else {
        alert(
          "Ha ocurrido un error inesperado. Por favor, inténtelo más tarde."
        );
      }
    } catch (error) {
      if (error.response.status == 401) {
        alert("No tienes permisos para acceder a este recurso.");
      } else if (error.response.status == 404) {
        alert("La cuenta actual no existe.");
      } else {
        alert(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("orienteering-me-token");
    setToken(token!);

    if (token) {
      getData();
    }
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
        {courseData.name}
      </Typography>
      <Typography
        variant="h6"
        noWrap
        sx={{
          mt: 2,
          display: "flex",
          fontWeight: 700,
          letterSpacing: ".1rem",
        }}
      >
        Creador
      </Typography>
      <Typography
        variant="h6"
        noWrap
        sx={{
          mb: 2,
          display: "flex",
        }}
      >
        {courseData.admin}
      </Typography>
      <CourseStreetMap
        checkpoints={courseData.checkpoints.map(
          (checkpoint: CheckpointProps) => {
            return {
              number: checkpoint.number,
              lat: checkpoint.lat,
              lng: checkpoint.lng,
              qr_code: checkpoint.qr_code,
            };
          }
        )}
      />
      <DeleteCourseFormDialog />
    </Box>
  );
}

Course.getInitialProps = async ({ query }) => {
  // Access query parameters from query object
  const { name } = query;
  // Fetch data based on query parameters
  // Return data as props
  return { name };
};
