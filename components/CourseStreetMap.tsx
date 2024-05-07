import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { Typography } from "@mui/material";
import QRCode from "react-qr-code";

interface CheckpointProps {
  number: number;
  lat: number;
  lng: number;
  qr_code: string;
}

interface CheckpointsProps {
  checkpoints: CheckpointProps[];
}

function CourseStreetMap({ checkpoints }: CheckpointsProps) {
  const Center = { lat: 40.421078, lng: -3.704622 };
  const ZoomLevel = 8;

  function LocateMap() {
    const map = useMap();

    useEffect(() => {
      map.setView([checkpoints[0].lat, checkpoints[0].lng]);
    }, [map]);

    return null;
  }

  return (
    <div className="container" style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={Center}
        zoom={ZoomLevel}
        doubleClickZoom={false}
        maxZoom={17}
      >
        <LocateMap />
        <TileLayer
          attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        />
        {checkpoints.map(({ number, lat, lng, qr_code }) => (
          <Marker
            position={[lat, lng]}
            icon={
              new Icon({
                iconUrl:
                  number == 0
                    ? "start_checkpoint.svg"
                    : number == checkpoints.length - 1
                    ? "finish_checkpoint.svg"
                    : "checkpoint.svg",
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              })
            }
            key={number}
          >
            <Popup>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mb: 1,
                  display: "flex",
                  fontWeight: 700,
                  justifyContent: "center",
                }}
              >
                Punto de control {number + 1}
              </Typography>
              <QRCode
                value={qr_code}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                size={200}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CourseStreetMap;
