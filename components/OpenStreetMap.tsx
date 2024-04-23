import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const center = { lat: 40.421078, lng: -3.704622 };

function MyComponent() {
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      map.setView([e.latlng.lat, e.latlng.lng]);
    });
  }, [map]);

  return null;
}

function OpenStreetMap() {
  const [position, setPosition] = useState(center);
  const markerRef = useRef(null);
  const ZOOM_LEVEL = 8;

  return (
    <div className="container" style={{ height: "100%", width: "100%" }}>
      <MapContainer center={center} zoom={ZOOM_LEVEL}>
        <MyComponent />
        <TileLayer
          attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}

export default OpenStreetMap;
