import { useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Link, NavLink } from "react-router-dom";
import lupa from "./../../assets/lupita.png";
import { wpUrlToClientPath } from "../../helpers/wpUrlToClientPath";

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
  );
}
