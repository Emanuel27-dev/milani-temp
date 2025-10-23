import { useEffect, useState } from "react";
import axios from "axios";

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("La geolocalización no está soportada por este navegador.");
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });

        try {
          // Llamada a API de geocodificación inversa
          const res = await axios.get(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
          );

          const data = res.data;
          setLocation({
            ciudad: data.city || data.locality || "Desconocida",
            pais: data.countryName || "Desconocido",
          });
        } catch (e) {
          setError("No se pudo obtener la ubicación detallada", e);
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return { coords, location, error };
}
