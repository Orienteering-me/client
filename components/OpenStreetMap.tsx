import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

function OpenStreetMap() {
  const [center, setCenter] = useState({ lat: 28.487897, lng: -16.313677 });
  const ZOOM_LEVEL = 8;

  return (
    <div className="container" style={{ height: "100%", width: "100%" }}>
      <MapContainer center={center} zoom={ZOOM_LEVEL}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[28.487897, -16.313677]}></Marker>
      </MapContainer>
    </div>
  );
}

export default OpenStreetMap;
