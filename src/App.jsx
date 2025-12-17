import { Navigate, Route, Routes } from 'react-router-dom'
import './milaniStyles.css';
import { Layout } from './Layout';
import { WpPage } from './WpPage';

function App() {

  return (
    <>
    <Routes>
      {/* HOME LIMPIO */}
      <Route path="/" element={<Layout />}>
        <Route index element={<WpPage fixedSlug="home" />} />

        {/* TODAS LAS PAGES / SERVICES */}
        <Route path="*" element={<WpPage />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
