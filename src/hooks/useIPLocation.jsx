// src/hooks/useIPLocation.js
import { useEffect, useState } from "react";
import axios from "axios";

export function useIPLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await axios.get("https://ipwho.is/");

        console.log("🌍 IP LOCATION RAW RESPONSE", res.data);

        if (!res.data || res.data.success === false) {
          throw new Error("IP service failed");
        }

        setLocation({
          ciudad: res.data.city,
          region: res.data.region,
          country: res.data.country,
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          ip: res.data.ip,
        });
      } catch (err) {
        console.error("❌ IP LOCATION ERROR", err);
        setError("No se pudo obtener la ubicación por IP");
        setLocation(null);
      } finally {
        setLoadingLocation(false);
      }
    }

    fetchLocation();
  }, []);

  return { location, error, loadingLocation };
}
