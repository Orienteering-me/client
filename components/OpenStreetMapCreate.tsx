import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { Typography } from "@mui/material";

function LocateMap() {
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      map.setView([e.latlng.lat, e.latlng.lng]);
    });
  }, [map]);

  return null;
}

function OpenStreetMapCreateCourse() {
  const Center = { lat: 40.421078, lng: -3.704622 };
  const ZoomLevel = 8;
  const [checkpoints, setCheckpoints] = useState<
    { lat: number; lng: number }[]
  >([]);

  function CheckpointManager() {
    useMapEvents({
      dblclick(e) {
        const clicked_position = { lat: e.latlng.lat, lng: e.latlng.lng };
        setCheckpoints(
          checkpoints.concat([
            {
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
                ? "start_checkpoint_marker.svg"
                : index == checkpoints.length - 1
                ? "finish_checkpoint_marker.svg"
                : "checkpoint_marker.svg",
            iconSize: [50, 41],
            iconAnchor: [25, 41],
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
        Para eliminar el último punto de control creado pulse Suprimir o Borrar.
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
  );
}

export default OpenStreetMapCreateCourse;
