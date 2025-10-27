// Layout.jsx
import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { useWpAssets } from "./hooks/useWpAssets";
import { useWpGlobalAssets } from "./hooks/useWpGlobalAssets";

export function Layout() {
  useWpAssets();
  useWpGlobalAssets();

  return (
    <>
      <Header />

      {/* Estructura idéntica a Salient */}
      <div className="ocm-effect-wrap">
        <div className="ocm-effect-wrap-inner">
          <div id="ajax-content-wrap">
            <div className="container-wrap">
              <div className="container main-content" role="main">
                <div className="row">
                  <Outlet /> {/* aquí entra <WpPage /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
