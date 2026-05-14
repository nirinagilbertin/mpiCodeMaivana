import { useState, useEffect } from "react";
import { MAP_CENTER } from "../config/constants";

interface GeolocationState {
  latitude: number;
  longitude: number;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeolocationState>({
    latitude: MAP_CENTER.lat,
    longitude: MAP_CENTER.lng,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setPosition((prev) => ({
        ...prev,
        error: "Géolocalisation non supportée par ce navigateur",
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        setPosition((prev) => ({
          ...prev,
          error: "Impossible d'obtenir votre position. Utilisation de la position par défaut.",
          loading: false,
        }));
        console.warn("Geolocation error:", err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  return position;
}