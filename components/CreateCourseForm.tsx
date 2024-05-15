import { useEffect, useState } from "react";
import { Alert, Button, TextField, Typography } from "@mui/material";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Icon } from "leaflet";
import axios from "axios";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";

function CreateCourseForm() {
  const router = useRouter();
  const Center = { lat: 40.421078, lng: -3.704622 };
  const ZoomLevel = 8;
  const [checkpoints, setCheckpoints] = useState<
    { course: String; number: number; lat: number; lng: number }[]
  >([]);
  const [name, setName] = useState("");

  const [nameHasSpecialCharacters, setNameHasSpecialCharacters] =
    useState(false);
  const [validNumberOfCheckpoints, setValidNumberOfCheckpoints] =
    useState(true);

  function LocateMap() {
    const map = useMap();

    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        map.setView([e.latlng.lat, e.latlng.lng]);
      });
    }, [map]);

    return null;
  }

  async function handleSubmit(this: any, event: any) {
    event.preventDefault();
    setNameHasSpecialCharacters(!name.match(`^[a-zA-Z0-9]+$`));
    setValidNumberOfCheckpoints(checkpoints.length >= 2);
    const token = localStorage.getItem("orienteering-me-token");

    if (!nameHasSpecialCharacters && validNumberOfCheckpoints) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URI}/courses`,
          {
            name: name,
            checkpoints: checkpoints,
          },
          {
            headers: {
              "orienteering-me-token": token,
            },
          }
        );
        if (response.status == 200) {
          alert("La carrera se ha registrado correctamente.");
        } else {
          alert(
            "Ha ocurrido un error inesperado. Por favor, inténtelo más tarde."
          );
        }
        router.push("course?name=" + name);
      } catch (error) {
        if (error.response.status == 409) {
          alert("Ya existe una carrera registrada con este nombre.");
        } else {
          alert(
            "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
          );
        }
      }
    }
  }

  function CheckpointManager() {
    useMapEvents({
      dblclick(e) {
        const clicked_position = { lat: e.latlng.lat, lng: e.latlng.lng };
        setCheckpoints(
          checkpoints.concat([
            {
              course: name,
              number: checkpoints.length,
              lat: clicked_position.lat,
              lng: clicked_position.lng,
            },
          ])
        );
      },
      keydown(e) {
        if (
          e.originalEvent.key == "Delete" ||
          e.originalEvent.key == "Backspace"
        ) {
          setCheckpoints(checkpoints.slice(0, -1));
        }
      },
    });

    return checkpoints.map(({ lat, lng }, index) => (
      <Marker
        position={[lat, lng]}
        icon={
          new Icon({
            iconUrl:
              index == 0
                ? "start_checkpoint.svg"
                : index == checkpoints.length - 1
                ? "finish_checkpoint.svg"
                : "checkpoint.svg",
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          })
        }
        key={index}
      >
        <Popup>
          Punto de control {index + 1} con latitud {lat} y longitud {lng}
        </Popup>
      </Marker>
    ));
  }

  return (
    <form onSubmit={handleSubmit}>
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
        Crear nueva carrera
      </Typography>
      <TextField
        required
        fullWidth
        id="name-input"
        label="Nombre de la carrera"
        variant="outlined"
        margin="normal"
        onChange={(e) => setName(e.target.value)}
      />
      {nameHasSpecialCharacters ? (
        <Alert variant="filled" severity="error" style={{ marginBottom: 20 }}>
          El nombre de una carrera no puede contener caracteres especiales.
        </Alert>
      ) : (
        <></>
      )}
      <div className="container" style={{ height: "100%", width: "100%" }}>
        <Typography
          noWrap
          sx={{
            display: "flex",
          }}
        >
          Para añadir un nuevo punto de control haga doble click sobre el mapa.
        </Typography>
        <Typography
          noWrap
          sx={{
            display: "flex",
            marginBottom: "1%",
          }}
        >
          Para eliminar el último punto de control creado pulse Suprimir o
          Borrar.
        </Typography>
        <MapContainer
          center={Center}
          zoom={ZoomLevel}
          doubleClickZoom={false}
          maxZoom={17}
        >
          <LocateMap />
          <CheckpointManager />
          <TileLayer
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
      {!validNumberOfCheckpoints ? (
        <Alert variant="filled" severity="error" style={{ marginTop: 10 }}>
          Una carrera debe tener un mínimo de dos puntos de control.
        </Alert>
      ) : (
        <></>
      )}
      <Button
        type="submit"
        variant="contained"
        style={{
          marginTop: 25,
          marginBottom: 10,
          marginLeft: "5%",
          color: "white",
          fontWeight: 700,
          width: "90%",
        }}
      >
        Crear recorrido
      </Button>
    </form>
  );
}

export default CreateCourseForm;
