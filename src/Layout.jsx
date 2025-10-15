import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";

export function Layout() {
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
