import { useEffect, useState } from "react";
import axios from "axios";

export function useIPLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await axios.get("https://ipapi.co/json/");
        setLocation({
          ciudad: res.data.city,
          region: res.data.region,
          pais: res.data.country_name,
          ip: res.data.ip,
        });
      } catch (err) {
        setError("No se pudo obtener la ubicación por IP", err);
      }
    }
    fetchLocation();
  }, []);

  return { location, error };
}
