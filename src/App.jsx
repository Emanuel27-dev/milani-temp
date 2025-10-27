import { Navigate, Route, Routes } from 'react-router-dom'
import './milaniStyles.css';
import { Layout } from './Layout';
import { Home } from './Home';
import { WpPage } from './WpPage';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={ <WpPage fixedSlug={"home"} />} />

        {/* Esta ruta captura /drainage /plumbing, /offers, /heating, etc */}
        <Route path='*' element={<WpPage />} />
        {/* <Route path='*' element={ <Navigate replace to={"/"} /> } /> */}
      </Route>
    </Routes>
    </>
  )
}

export default App
