import { useEffect, useContext } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Icon } from "leaflet";
import { Typography } from "@mui/material";
import { ModifyCourseContext } from "../../hooks/ModifyCourseContext";

function CreateCourseMap() {
  const center = { lat: 40.421078, lng: -3.704622 };
  const { courseName, checkpoints, setCheckpoints } =
    useContext(ModifyCourseContext);

  function CheckpointManager() {
    useMapEvents({
      dblclick(e) {
        const clicked_position = { lat: e.latlng.lat, lng: e.latlng.lng };
        setCheckpoints(
          checkpoints!.concat([
            {
              course: courseName,
              number: checkpoints!.length,
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
          setCheckpoints(checkpoints!.slice(0, -1));
        }
      },
    });

    return null;
  }

  return (
    <div className="container" style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={center}
        zoom={5}
        doubleClickZoom={false}
        maxZoom={17}
        style={{
          height: "60vh",
          width: "100%",
        }}
      >
        <CheckpointManager />
        <TileLayer
          attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        />
        {checkpoints!.map(({ lat, lng, number }, index) => (
          <Marker
            position={[lat, lng]}
            icon={
              new Icon({
                iconUrl:
                  index == 0
                    ? "/start_checkpoint.svg"
                    : index == checkpoints!.length - 1
                    ? "/finish_checkpoint.svg"
                    : "/checkpoint.svg",
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              })
            }
            key={index}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
              {number + 1}
            </Tooltip>
            <Popup>
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                Punto de control {number + 1} con latitud {lat} y longitud {lng}
              </Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CreateCourseMap;
