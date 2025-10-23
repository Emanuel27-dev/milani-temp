import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './Layout';
import { Home } from './Home';
import { WpPage } from './WpPage';
import { useGeolocation } from './hooks/useGeolocation';

function App() {

  const { coords, location, error } = useGeolocation();

  return (
    // <>
    // <Routes>
    //   <Route path='/' element={<Layout />}>
    //     <Route index element={ <WpPage fixedSlug={"home"} />} />

     
    //     <Route path='*' element={<WpPage />} />
        
    //   </Route>
    // </Routes>
    // </>

        <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>🌍 Detector de ubicación</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {location ? (
        <>
          <p><strong>Ciudad:</strong> {location.ciudad}</p>
          <p><strong>País:</strong> {location.pais}</p>
          <p><strong>Latitud:</strong> {coords?.latitude.toFixed(4)}</p>
          <p><strong>Longitud:</strong> {coords?.longitude.toFixed(4)}</p>
        </>
      ) : (
        <p>Obteniendo ubicación...</p>
      )}
    </div>
  )
}

export default App
