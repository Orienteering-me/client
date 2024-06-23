import { useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

export interface CoursesProps {
  name: string;
  admin: string;
  lat: number;
  lng: number;
}

interface MainPageMapProps {
  courses: CoursesProps[];
}

function MainPageMap({ courses }: MainPageMapProps) {
  const center = { lat: 40.421078, lng: -3.704622 };

  function LocateMap() {
    const map = useMap();

    useEffect(() => {
      map.zoomControl.setPosition("bottomright");
      map.locate().on("locationfound", function (e) {
        map.setView([e.latlng.lat, e.latlng.lng], 8);
      });
    }, [map]);

    return null;
  }

  return (
    <div className="container" style={{ height: "100%", width: "100%" }}>
      <MapContainer center={center} zoom={4} maxZoom={17}>
        <LocateMap />
        <TileLayer
          attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        />
        {courses.map(({ name, admin, lat, lng }) => (
          <Marker position={[lat, lng]} key={name}>
            <Popup>
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                "{name}", creado por {admin}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                href={"course?name=" + name}
                style={{
                  marginBottom: 5,
                  fontWeight: 700,
                  color: "white",
                }}
                color="primary"
              >
                Ver información
              </Button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MainPageMap;
