// Layout.jsx
import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { useWpAssets } from "./hooks/useWpAssets";
import { useWpGlobalAssets } from "./hooks/useWpGlobalAssets";
import { HeaderTemp } from "./components/Header/HeaderTemp";
import { Helmet } from "react-helmet-async";

export function Layout() {
  useWpAssets();
  useWpGlobalAssets();

  return (
    <>

      {/* <Helmet>
        <title>Milani plumbing heating & air conditioning</title>
      </Helmet> */}
      {/* <Header /> */}
      <HeaderTemp />

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
