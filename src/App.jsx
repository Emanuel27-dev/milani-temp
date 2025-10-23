import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './Layout';
import { Home } from './Home';
import { WpPage } from './WpPage';
// import { useGeolocation } from './hooks/useGeolocation';
import { useIPLocation } from './hooks/useIPLocation';

function App() {

  const { location, error } = useIPLocation();

  return (
    // <>
    // <Routes>
    //   <Route path='/' element={<Layout />}>
    //     <Route index element={ <WpPage fixedSlug={"home"} />} />

     
    //     <Route path='*' element={<WpPage />} />
        
    //   </Route>
    // </Routes>
    // </>

    <div style={{ padding: 20 }}>
      <h2>🌐 Ubicación según IP / VPN</h2>
      {error && <p>{error}</p>}
      {location ? (
        <>
          <p><strong>IP:</strong> {location.ip}</p>
          <p><strong>Ciudad:</strong> {location.ciudad}</p>
          <p><strong>Región:</strong> {location.region}</p>
          <p><strong>País:</strong> {location.pais}</p>
        </>
      ) : (
        <p>Detectando ubicación por IP...</p>
      )}
    </div>
  )
}

export default App
