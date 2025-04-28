"use client";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

interface Product {
  ProductName: string;
  CarbonFootprint_per_kg: number;
  LandUse_per_kg: number;
  WaterUse_per_kg: number;
  TotalEmissions: number;
  FuelUsageGallons: number;
  Location: {
    latitude: number;
    longitude: number;
  };
}

interface ClientMapProps {
  selectedProduct: Product | null;
  userLocation: { latitude: number; longitude: number } | null;
}

export default function ClientMap({ selectedProduct, userLocation }: ClientMapProps) {
  if (!selectedProduct || !userLocation) return null;
  return (
    <MapContainer
      center={[(selectedProduct.Location.latitude + userLocation.latitude) / 2, (selectedProduct.Location.longitude + userLocation.longitude) / 2]}
      zoom={4}
      style={{ height: "260px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {/* Food Item Marker */}
      <Marker position={[selectedProduct.Location.latitude, selectedProduct.Location.longitude]} />
      {/* User Marker */}
      <Marker position={[userLocation.latitude, userLocation.longitude]} />
    </MapContainer>
  );
}
