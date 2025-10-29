import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Link, NavLink } from "react-router-dom";
import lupa from "./../../assets/lupa.svg";
import location from "./../../assets/location.svg";
import wassp from "./../../assets/Phone.svg";
import { wpUrlToClientPath } from "../../helpers/wpUrlToClientPath";
import { ZipModal } from "./ZipModal";

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
    menuKelowa {
      label
      url
      target
      kind
      objectType
      objectId
    }
    menuVancouver {
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

  const [showToolTip, setShowToolTip] = useState(false);
  const [showZipModal ,setShowZipModal] = useState(false);

  useEffect(() => {
    const toggleBtn = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (!toggleBtn || !mobileMenu) return;

    const handleToggle = () => {
      mobileMenu.classList.toggle("open");
    };

    toggleBtn.addEventListener("click", handleToggle);

    return () => {
      toggleBtn.removeEventListener("click", handleToggle);
    };
  }, []);

  if (loading || !data) return null;

  // United States
  const mainItems =
    location?.pais === "United States" ? data.menuVancouver : data.menuKelowa; // cambio automático

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
          <nav className="menus">
            <div className="top-menu">
              {data.topMenu.map((item) => {
                // Convirtiendo la URL absoluta de WP a /offers, /heating, etc
                const to = wpUrlToClientPath(item.url);
                return (
                  <NavLink
                    key={item.label}
                    to={to}
                    className={({ isActive }) =>
                      `link ${isActive ? "active" : ""}`
                    }
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
              {data.mainMenu.map((item) => {
                // Convirtiendo la URL absoluta de WP a /plumbing, /drainage, etc
                const to = wpUrlToClientPath(item.url);
                return (
                  <NavLink
                    key={item.label}
                    to={to}
                    className={({ isActive }) =>
                      `$link ${isActive ? "active" : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* ICONO HAMBURGUESA */}
          <button className="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
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
              Fast, Fair and Reliable Service in <span>Kelowna.</span> 100%
              Guarantee
            </h4>
            <div className="header-below__details">
              <button
                className="location-btn"
                onClick={() => setShowToolTip(!showToolTip)}
              >
                <img src={location} alt="icono de ubicacion" />
                <div class="location-btn__text">
                  <p class="location-btn__label">Current Location</p>
                  <p class="location-btn__city">Miami-Florida</p>
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
        <ZipModal isOpen={showZipModal} onClose={() => setShowZipModal(false)} />

      </div>
    </>
  );
}
