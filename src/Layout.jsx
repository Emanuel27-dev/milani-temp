// import { Outlet } from "react-router-dom";
// import { Footer } from "./components/Footer/Footer";
// import { Header } from "./components/Header/Header";
// import { useWpAssets } from "./hooks/useWpAssets";

// export function Layout() {
//   useWpAssets();

//   return (
//     <main>
//       <Header />
//       <section className="outlet">
//         <div className="container">
//           <Outlet />
//         </div>
//       </section>
//       <Footer />
//     </main>
//   );
// }

// Layout.jsx
import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { useWpAssets } from "./hooks/useWpAssets";

export function Layout() {
  useWpAssets(); // carga CSS/JS del theme + WPBakery

  return (
    // <div>
    //   <Header />
    //   <div id="ajax-content-wrap">
    //     <div className="container main-content" role="main">
    //       <div className="row">
    //         {/* El contenido de la página debe vivir dentro de .row */}
    //         <Outlet />
    //       </div>
    //     </div>

    //     <Footer />
    //   </div>
    // </div>
    <>
      <Header />
      {/* className="container-wrap" ponerlo en main */}
      <main id="ajax-content-wrap"  role="main">
        <div className="container main-content">
          <Outlet /> {/* <WpPage /> u otros componentes */}
        </div>
      </main>
      <Footer />
    </>
  );
}
