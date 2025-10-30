import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Link, NavLink } from "react-router-dom";
import lupa from "./../../assets/lupa.svg";
import locationsvg from "./../../assets/location.svg";
import wassp from "./../../assets/Phone.svg";
import { wpUrlToClientPath } from "../../helpers/wpUrlToClientPath";
import { ZipModal } from "./ZipModal";
import { useIPLocation } from "../../hooks/useIPLocation";

const GET_HEADER = gql`
query {
  salientLogo
  topMenu {
    label
    url
    target
    kind
    objectType
    objectId
  }
  mainMenu {
    label
    url
    target
    kind
    objectType
    objectId
  }
  menuCA {
    label
    url
    target
    kind
    objectType
    objectId
  }
  menuUS {
    label
    url
    target
    kind
    objectType
    objectId
  }
}
`;

export function HeaderTemp() {
  const { data, loading } = useQuery(GET_HEADER);
  const { location } = useIPLocation();

  const [showToolTip, setShowToolTip] = useState(() => {
    return localStorage.getItem("currentLocation") ? false : true;
  });
  const [showZipModal, setShowZipModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(() => {
    return localStorage.getItem("currentLocation") || "Kelowna";
  });

 // 👇 NUEVO: Estado para manejar el menú (hamburguesa)
  const [menuOpen, setMenuOpen] = useState(false);
  // 👇 NUEVO: Efecto para manejar clicks y clases
  useEffect(() => {
    const toggleBtn = document.querySelector(".menu-toggle");
    const menus = document.querySelector(".menus");
    if (!toggleBtn || !menus) return;
    const handleToggle = () => {
      // Solo aplica si el ancho es menor o igual a 1000px
      if (window.innerWidth <= 1000) {
        setMenuOpen((prev) => !prev);
      }
    };
    toggleBtn.addEventListener("click", handleToggle);
    return () => toggleBtn.removeEventListener("click", handleToggle);
  }, []);
  // 👇 NUEVO: Cerrar menú al cambiar el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // Detectar país y actualizar ubicación automáticamente
  useEffect(() => {
    if (location?.pais === "United States" && currentLocation !== "Seattle") {
      setCurrentLocation("Seattle");
    } else if (
      location?.pais !== "United States" &&
      currentLocation === "Seattle"
    ) {
      setCurrentLocation("Kelowna");
    }
  }, [location]);

  useEffect(() => {
    localStorage.setItem("currentLocation", currentLocation);
  }, [currentLocation]);

  if (loading || !data) return null;

    // 🔹 Seleccionar el menú correcto dinámicamente
  const mainItems = location?.pais === "United States" ? data.menuUS : data.menuCA;

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* LOGO */}
          <Link to={"/"}>
            <div className="logo-block">
              <img src={data.salientLogo} alt="Milani Logo" className="logo" />
            </div>
          </Link>

          {/* MENÚS */}
          <nav className={`menus ${menuOpen ? "active" : ""}`}>
              {/* 🔹 Botón X para cerrar (solo aparece si está abierto y en mobile) */}
            {menuOpen && window.innerWidth <= 1000 && (
              <button
                className="close-menu"
                onClick={() => setMenuOpen(false)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "15px",
                  background: "none",
                  border: "none",
                  fontSize: "28px",
                  cursor: "pointer",
                  color: "#ffffff",
                }}
              >
                ✕
              </button>
            )}
            <div className="top-menu">
              {data.topMenu.map((item) => {
                const to = wpUrlToClientPath(item.url);
                return (
                  <NavLink
                    key={item.label}
                    to={to}
                    className={({ isActive }) =>
                      `link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMenuOpen(false)} // Cierra menú al hacer click
                  >
                    {item.label}
                  </NavLink>
                );
              })}

              <button className="search-btn">
                <img src={lupa} alt="lupa" />
              </button>
            </div>

            <div className="main-menu">
              {mainItems.map((item) => {
                const to = wpUrlToClientPath(item.url);
                return (
                  <NavLink
                    key={item.label}
                    to={to}
                    className={({ isActive }) =>
                      `$link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMenuOpen(false)} // Cierra menú al clickear
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* ICONO HAMBURGUESA */}
          <button className="menu-toggle">
            {!menuOpen ? (
              <>
                <span></span>
                <span></span>
                <span></span>
              </>
            ) : (
              <span style={{ fontSize: "24px" }}>✕</span>
            )}
          </button>
        </div>

        {/* MENÚ MÓVIL */}
        <div className="mobile-menu">
          <div className="mobile-main">
            <a href="#">Plumbing</a>
            <a href="#">Drainage</a>
            <a href="#">Heating</a>
            <a href="#">Air Conditioning</a>
          </div>
          <hr />
          <div className="mobile-top">
            <a href="#">Commercial Services</a>
            <a href="#">Rebates</a>
            <a href="#">Rewards</a>
            <a href="#">Offers</a>
            <a href="#">Online Payments</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </header>

      <div className="header-below">
        <div className="header-container">
          <div className="header-below__info">
            <h4 className="header-below__headline">
              Fast, Fair and Reliable Service in <span>{currentLocation}.</span>{" "}
              100% Guarantee
            </h4>
            <div className="header-below__details">
              <button
                className="location-btn"
                onClick={() => setShowToolTip(!showToolTip)}
              >
                <img src={locationsvg} alt="icono de ubicacion" />
                <div class="location-btn__text">
                  <p class="location-btn__label">Current Location</p>
                  <p class="location-btn__city">{currentLocation}</p>
                </div>
              </button>

              <h6 class="header-below__subtitle">
                A Family Owned Canadian Business
              </h6>
            </div>

            {/* Tooltip */}
            {showToolTip && (
              <div className="location-tooltip">
                <h5 className="location-tooltip__title">
                  Want to see options closer to your home?
                </h5>
                <p className="location-tooltip__description">
                  Select your location to show available services in your area.
                </p>
                <div className="location-tooltip__buttons">
                  <button
                    className="tooltip-btn tooltip-btn--primary"
                    onClick={() => {
                      setShowZipModal(true);
                      setShowToolTip(false);
                    }}
                  >
                    CHANGE LOCATION
                  </button>
                  <button
                    className="tooltip-btn tooltip-btn--secondary"
                    onClick={() => setShowToolTip(false)}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="buttons-header">
            <button className="button">
              <img src={wassp} alt="phone" />
              <div>250.900.900</div>
            </button>
            <button className="button">BOOK NOW</button>
          </div>
        </div>

        {/* <ZipModal /> */}
        <ZipModal
          isOpen={showZipModal}
          onClose={() => setShowZipModal(false)}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          showToolTip={showToolTip}
          setShowToolTip={setShowToolTip}
        />
      </div>
    </>
  );
}
