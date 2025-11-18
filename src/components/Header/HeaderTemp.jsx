import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import lupa from "./../../assets/lupa.svg";
import locationsvg from "./../../assets/location.svg";
import location2svg from "./../../assets/location2.svg";
import wassp from "./../../assets/Phone.svg";
import { wpUrlToClientPath } from "../../helpers/wpUrlToClientPath";
import { ZipModal } from "./ZipModal";
import { useIPLocation } from "../../hooks/useIPLocation";

export function HeaderTemp({ data }) {
  const { location } = useIPLocation();
  const [openDropdown, setOpenDropDown] = useState(null);

  const [showToolTip, setShowToolTip] = useState(
    !localStorage.getItem("currentLocation")
  );
  const [showZipModal, setShowZipModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(
    localStorage.getItem("currentLocation") || "Kelowna"
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 1000 : false
  );

  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
      if (window.innerWidth > 1000) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // 🔹 Usa los menús jerárquicos ya preparados en WP
  const mainItems =
    location?.pais === "United States" ? data.menuUS : data.menuCA;

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to={"/"}>
            <div className="logo-block">
              <img src={data.salientLogo} alt="Milani Logo" className="logo" />
            </div>
          </Link>

          <nav className={`menus ${menuOpen ? "active" : ""}`}>
            <ul className="top-menu">
              {data.topMenu.map((item) => (
                <li className="menu-item-top" key={item.label}>
                  <NavLink
                    to={wpUrlToClientPath(item.url)}
                    className={({ isActive }) =>
                      `link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <button
                className="search-btn"
                onClick={() => setOpenSearch(true)}
              >
                <img src={lupa} alt="lupa" />
              </button>
            </ul>

            {/* 🔹 Menú principal con hijos */}
            <ul className="main-menu" style={{ listStyle: "none" }}>
              {mainItems.map((item, index) => {
                const children = item.children || [];

                return (
                  <li
                    key={item.label}
                    className="menu-item"
                    onMouseEnter={() => setOpenDropDown(index)}
                    onMouseLeave={() => setOpenDropDown(null)}
                    style={{ listStyle: "none" }}
                  >
                    <NavLink
                      to={wpUrlToClientPath(item.url)}
                      className={({ isActive }) =>
                        `link ${isActive ? "active" : ""}`
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>

                    {/* 👇 Dropdown si tiene hijos */}
                    {children.length > 0 && (
                      <ul
                        className={`dropdown ${
                          openDropdown === index ? "show" : ""
                        }`}
                        style={{ listStyle: "none" }}
                      >
                        {children.map((child) => (
                          <li key={child.label} style={{ listStyle: "none" }}>
                            <NavLink
                              to={wpUrlToClientPath(child.url)}
                              className="dropdown-link"
                            >
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((p) => !p)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* 🔍 Search Overlay */}
      <div
        id="search-outer"
        className={`search-overlay ${openSearch ? "active" : ""}`}
      >
        <div className="search-box">
          <form
            role="search"
            action="https://milani.xpress.ws/"
            method="GET"
            className="search-form"
          >
            <input
              type="text"
              name="s"
              aria-label="Search"
              placeholder="Search"
              autoFocus
            />
          </form>
          <button className="close-search" onClick={() => setOpenSearch(false)}>
            ✕
          </button>
        </div>
      </div>

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
                <div className="location-btn__text">
                  {/* <p className="location-btn__label">Current Location</p> */}
                  <p className="location-btn__city">{currentLocation}</p>
                </div>
              </button>

              <h6 className="header-below__subtitle">
                A Family Owned Canadian Business
              </h6>
            </div>

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
                    <img src={location2svg} alt="location" />
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
