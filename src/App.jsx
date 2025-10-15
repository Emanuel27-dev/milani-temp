import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './Layout';
import { Home } from './Home';
import { WpPage } from './WpPage';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={ <Home /> } />

        {/* Esta ruta captura /plumbing, /offers, /heating, etc */}
        <Route path=':slug' element={<WpPage />} />
        <Route path='*' element={ <Navigate replace to={"/"} /> } />
      </Route>
    </Routes>
    </>
  )
}

export default App
