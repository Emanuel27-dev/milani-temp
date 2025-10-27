// Layout.jsx
import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { useWpAssets } from "./hooks/useWpAssets";
import { useWpGlobalAssets } from "./hooks/useWpGlobalAssets"; // ✅ nuevo

export function Layout() {
  useWpAssets(); // Archivos CSS/JS físicos (tema, plugins)
  useWpGlobalAssets(); // Estilos y bodyAttributes desde GraphQL

  return (
    <>
      <Header />
      <main id="ajax-content-wrap" role="main">
        <div className="container main-content">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
