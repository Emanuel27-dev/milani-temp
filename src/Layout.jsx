import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { useWpAssets } from "./hooks/useWpAssets";


export function Layout() {
  useWpAssets(); // hook para añadir estilos

  return (
    <main>
      <Header />
      <section className="outlet">
        <div className="container">
          <Outlet />
        </div>
      </section>
      <Footer />
    </main>
  );
}
