import { useEffect, useState } from "react";
import axios from "axios";

export function useIPLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await axios.get("https://ipapi.co/json/");
        setLocation({
          // pais: res.data.country,
          // paisCodigo: res.data.countryCode,
          ciudad: res.data.city,
          // regionNombre: res.data.regionName,
          // regionCode: res.data.region,
        });
      } catch (err) {
        setError("No se pudo obtener la ubicación por IP", err);
      } finally {
        setLoadingLocation(false);
      }
    }
    fetchLocation();
  }, []);

  return { location, error, loadingLocation };
}
