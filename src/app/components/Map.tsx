import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix for default marker icons in production
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  metrics: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface MapProps {
  locations: Location[];
}

const Map: React.FC<MapProps> = ({ locations }) => {
  // Find center point from locations or use default
  const center = locations.length > 0 
    ? [locations[0].lat, locations[0].lng]
    : [51.505, -0.09];

  return (
    <MapContainer
      center={[center[0], center[1]] as [number, number]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      className="rounded-lg shadow-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location) => (
        <Marker 
          key={location.id} 
          position={[location.lat, location.lng]}
          icon={icon}
        >
          <Popup>
            <div className="p-2">
              <h4 className="font-bold text-base mb-2">{location.name}</h4>
              <div className="space-y-1">
                <p className="text-green-600">
                  Positive: {location.metrics.positive}%
                </p>
                <p className="text-yellow-600">
                  Neutral: {location.metrics.neutral}%
                </p>
                <p className="text-red-600">
                  Negative: {location.metrics.negative}%
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;