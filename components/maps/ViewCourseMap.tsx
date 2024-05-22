import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { Button, Container, Typography } from "@mui/material";
import { QRCode } from "react-qrcode-logo";

interface Checkpoint {
  number: number;
  lat: number;
  lng: number;
  qr_code: string;
}

interface CourseMapProps {
  course_name: string;
  checkpoints: Checkpoint[];
  auth: boolean;
}

function ViewCourseMap({ course_name, checkpoints, auth }: CourseMapProps) {
  const Center = { lat: 40.421078, lng: -3.704622 };

  function LocateMap() {
    const map = useMap();

    useEffect(() => {
      map.setView([checkpoints[0].lat, checkpoints[0].lng]);
    }, [map]);

    return null;
  }

  function downloadQR(number: number) {
    const canvas: any = document.getElementById("qr-code");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${course_name}-${number + 1}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }

  return (
    <div className="container" style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={Center}
        zoom={10}
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
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                Punto de control {number + 1}
              </Typography>
              {auth ? (
                <Container
                  disableGutters
                  maxWidth={false}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <QRCode value={qr_code} size={124} id={"qr-code"} />
                  <Button
                    variant="contained"
                    fullWidth
                    style={{
                      marginTop: 25,
                      marginBottom: 5,
                      fontWeight: 700,
                      color: "white",
                    }}
                    color="primary"
                    onClick={() => {
                      downloadQR(number);
                    }}
                  >
                    Descargar QR
                  </Button>
                </Container>
              ) : (
                <></>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ViewCourseMap;
