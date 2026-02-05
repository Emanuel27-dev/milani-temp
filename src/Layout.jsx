// src/Layout.jsx
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { useWpAssets } from "./hooks/useWpAssets";
import { useWpGlobalAssets } from "./hooks/useWpGlobalAssets";
import { HeaderTemp } from "./components/Header/HeaderTemp";
import { useEffect, useState } from "react";
import { useIPLocation } from "./hooks/useIPLocation";
import { isCityInList } from "./helpers/isCityInList";
import { getPhone } from "./helpers/getPhone";
import { getRegionByCity } from "./helpers/getRegionByCity";
import { getRegionConfig } from "./helpers/getRegionConfig";
import { locations } from "./locations";

// =========================================================
// 🔹 Query del Header (logo + menús)
// =========================================================
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
      children {
        label
        url
      }
    }
    menuUS {
      label
      url
      target
      kind
      objectType
      objectId
      children {
        label
        url
      }
    }
  }
`;

// =========================================================
// 🔹 Query para precargar la página de inicio (/home/)
// =========================================================
const GET_HOME = gql`
  query GetHome($city: String) {
    contentNode(id: "/home/", idType: URI, city: $city) {
      __typename
      id
      databaseId
      uri
      slug
      ... on Page {
        title
        contentRendered
        wpbCss
        vcCustomCss
        dynamicCss
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage { sourceUrl }
          twitterTitle
          twitterDescription
          twitterImage { sourceUrl }
          schema { raw }
        }
        inlineDynamicCssGrouped {
          emoji
          global
          main
          dynamic
          file
        }
      }
      ... on Post {
        title
        contentRendered
        wpbCss
        vcCustomCss
        dynamicCss
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage { sourceUrl }
          twitterTitle
          twitterDescription
          twitterImage { sourceUrl }
          schema { raw }
        }
        inlineDynamicCssGrouped {
          emoji
          global
          main
          dynamic
          file
        }
      }
      ... on Service {
        title
        contentRendered
        wpbCss
        vcCustomCss
        dynamicCss
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage { sourceUrl }
          twitterTitle
          twitterDescription
          twitterImage { sourceUrl }
          schema { raw }
        }
        inlineDynamicCssGrouped {
          emoji
          global
          main
          dynamic
          file
        }
      }
    }
  }
`;

export function Layout() {
  useWpAssets();
  useWpGlobalAssets();

  // =========================================================
  // 🟢 NUEVO: FLAG PARA CONTROLAR CUÁNDO EL LAYOUT ESTÁ LISTO
  // =========================================================
  const [layoutReady, setLayoutReady] = useState(false);

  // =========================================================
  // 🟢 NUEVO: FLAG PARA CONTROLAR RESOLUCIÓN DE IP
  // =========================================================
  const [ipResolved, setIpResolved] = useState(false);

  // ---------------------------------------------------------
  // Estados existentes (NO TOCAR)
  // ---------------------------------------------------------
  const [currentLocation, setCurrentLocation] = useState(
    localStorage.getItem("currentLocation") || "Vancouver"
  );

  const [currentPhone, setCurrentPhone] = useState(
    localStorage.getItem("currentPhone") || "604.888.8888"
  );

  const [currentRegion, setCurrentRegion] = useState(() => {
    const saved = localStorage.getItem("currentRegion");
    return saved && saved.length ? saved : "lowermainland";
  });

  const navigate = useNavigate();
  const locationRouter = useLocation();
  const regionConfig = getRegionConfig(currentRegion);

  // ---------------------------------------------------------
  // IP LOCATION (NO TOCAR)
  // ---------------------------------------------------------
  const { location, loadingLocation } = useIPLocation();

  useEffect(() => {
    if (loadingLocation) return;
    console.log("🌍 IP LOCATION – DATA COMPLETA ↓↓↓");
    console.log(location);
    console.log("🌍 IP LOCATION – DATA COMPLETA ↑↑↑");
  }, [loadingLocation, location]);

  // ---------------------------------------------------------
  // 🔍 VALIDACIÓN CON locations.js
  // ---------------------------------------------------------
  const findRegionByCity = (city) => {
    if (!city) return null;
    const normalized = city.trim().toLowerCase();
    return locations.find((region) =>
      region.cities.some(
        (c) => c.name.trim().toLowerCase() === normalized
      )
    );
  };

  // ---------------------------------------------------------
  // 🟢 NUEVO: RESOLVER REGIÓN (slug o nombre)
  // ---------------------------------------------------------
  const getRegionFromLocations = (regionValue) => {
    if (!regionValue) return null;
    const normalized = regionValue.trim().toLowerCase();
    return locations.find(
      (r) =>
        r.slug === normalized ||
        r.region?.toLowerCase() === normalized
    );
  };

  useEffect(() => {
    if (localStorage.getItem("currentLocation")) {
      setIpResolved(true);
      return;
    }
    if (loadingLocation) return;
    if (!location || !location.ciudad) {
      setIpResolved(true);
      return;
    }

    const detectedCity = location.ciudad.trim();
    const regionMatch = findRegionByCity(detectedCity);

    if (regionMatch) {
      setCurrentLocation(detectedCity);
      localStorage.setItem("currentLocation", detectedCity);
      const phone = getPhone(detectedCity);
      setCurrentPhone(phone);
      localStorage.setItem("currentPhone", phone);
      setCurrentRegion(regionMatch.slug);
      localStorage.setItem("currentRegion", regionMatch.slug);
    } else {
      setCurrentLocation("Vancouver");
      localStorage.setItem("currentLocation", "Vancouver");
      setCurrentPhone("604.888.8888");
      localStorage.setItem("currentPhone", "604.888.8888");
      setCurrentRegion("lowermainland");
      localStorage.setItem("currentRegion", "lowermainland");
    }

    setIpResolved(true);
  }, [loadingLocation, location]);

  // ---------------------------------------------------------
  // Redirección por región (NO TOCAR)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!currentRegion || !ipResolved) return;
    if (locationRouter.state?.skipRegionRedirect) return;

    const regionSlug = currentRegion.toLowerCase().replace(/\s+/g, "");
    const pathname = locationRouter.pathname;

    if (
      pathname === `/${regionSlug}` ||
      pathname.startsWith(`/${regionSlug}/`)
    ) return;

    if (pathname === "/") {
      navigate(`/${regionSlug}`, { replace: true });
    }
  }, [
    currentRegion,
    ipResolved,
    locationRouter.pathname,
    locationRouter.state,
    navigate,
  ]);

  // =========================================================
  // 🟢 NUEVO: MARCAR LAYOUT COMO LISTO
  // =========================================================
  useEffect(() => {
    setLayoutReady(true);
  }, [locationRouter.pathname]);

// =========================================================
// 🟢 PINTAR REGION / CIUDAD / TELÉFONO + SERVICE LOCATIONS
// (SPA + RELOAD SAFE)
// =========================================================
useEffect(() => {
  if (!layoutReady) return;

  console.log("🟡 [Milani] Preparando pintado de datos…");

  let attempts = 0;
  const maxAttempts = 60;
  let raf1, raf2;

  const paint = () => {
    let didUpdate = false;

    const regionData = currentRegion
      ? getRegionFromLocations(currentRegion)
      : null;

    /* =====================================================
     * 1️⃣ SPANS: region / city / phone
     * ===================================================== */
    const regionEl = document.getElementById("region-milani");
    const cityEl = document.getElementById("city-milani");
    const phoneEl = document.getElementById("phone-milani");

    // REGION
    if (regionEl && regionData?.region) {
      if (regionEl.textContent !== regionData.region) {
        regionEl.textContent = regionData.region;
        didUpdate = true;
        console.log("✅ [Milani] Región (span):", regionData.region);
      }
    }

    // CIUDAD
    if (cityEl && currentLocation) {
      if (cityEl.textContent !== currentLocation) {
        cityEl.textContent = currentLocation;
        didUpdate = true;
        console.log("✅ [Milani] Ciudad (span):", currentLocation);
      }
    }

    // TELÉFONO
    if (phoneEl && currentPhone) {
      if (phoneEl.textContent !== currentPhone) {
        phoneEl.textContent = currentPhone;
        didUpdate = true;
        console.log("✅ [Milani] Teléfono (span):", currentPhone);
      }
    }

    /* =====================================================
     * 2️⃣ SERVICE LOCATIONS (si existe)
     * ===================================================== */
    const serviceRoot = document.getElementById("service-locations");

    if (serviceRoot && regionData) {
      // TELÉFONO
      const phoneH3 = serviceRoot.querySelector(
        ".section-location-number h3"
      );
      if (phoneH3 && currentPhone) {
        if (phoneH3.textContent !== currentPhone) {
          phoneH3.textContent = currentPhone;
          didUpdate = true;
          console.log("✅ [Milani] Teléfono (service):", currentPhone);
        }
      }

      // DIRECCIÓN / LABEL
      const phoneP = serviceRoot.querySelector(
        ".section-location-number p"
      );
      const addressText =
        regionData.address || regionData.label || "";

      if (phoneP && addressText) {
        if (phoneP.textContent !== addressText) {
          phoneP.textContent = addressText;
          didUpdate = true;
          console.log("✅ [Milani] Dirección (service):", addressText);
        }
      }

      // SUBTÍTULO
      const subtitle = serviceRoot.querySelector(
        ".text-subtitle-locations h3"
      );
      const subtitleText = `${regionData.region} Locations`;

      if (subtitle && subtitle.textContent !== subtitleText) {
        subtitle.textContent = subtitleText;
        didUpdate = true;
        console.log("✅ [Milani] Subtítulo:", subtitleText);
      }

      // CIUDADES (ORDEN ALFABÉTICO)
      const ul = serviceRoot.querySelector("ul");
      if (ul && Array.isArray(regionData.cities)) {
        const sortedCities = [...regionData.cities].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        const existing = ul.querySelectorAll("li").length;
        if (existing !== sortedCities.length) {
          ul.innerHTML = "";
          sortedCities.forEach((city) => {
            const li = document.createElement("li");
            li.textContent = city.name;
            ul.appendChild(li);
          });
          didUpdate = true;
          console.log(
            "✅ [Milani] Ciudades:",
            sortedCities.map((c) => c.name)
          );
        }
      }
    }

    return didUpdate;
  };

  const interval = setInterval(() => {
    attempts++;

    const updated = paint();

    if (updated) {
      console.log("🟢 [Milani] Datos pintados correctamente");
      clearInterval(interval);
      return;
    }

    if (attempts >= maxAttempts) {
      console.log("ℹ️ [Milani] No hay elementos a pintar (skip)");
      clearInterval(interval);
    }
  }, 150);

  // ⏱️ doble RAF → DOM real (WP + Salient)
  raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(() => {
      paint();
    });
  });

  return () => {
    clearInterval(interval);
    cancelAnimationFrame(raf1);
    cancelAnimationFrame(raf2);
  };

}, [
  layoutReady,
  locationRouter.pathname,
]);

  // ---------------------------------------------------------
  // Queries existentes (NO TOCAR)
  // ---------------------------------------------------------
  const { data, loading } = useQuery(GET_HEADER, { fetchPolicy: "cache-first" });
  const { data: homeData } = useQuery(GET_HOME, {
    variables: { currentLocation },
    fetchPolicy: "cache-first",
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const switchFormModal = () => setShowFormModal(!showFormModal);
  

  // =========================================================
// 🟢 NUEVO: ACTIVAR FORM MODAL DESDE ELEMENTOS .nectar-cta
// (SPA + RELOAD SAFE + HTML WP)
// =========================================================
useEffect(() => {
  const handleNectarCTA = (e) => {
    const cta = e.target.closest(".nectar-cta .link_wrap");
    if (!cta) return;

    e.preventDefault();
    console.log("🟣 [Milani] CTA detectado (.nectar-cta) → abrir formulario");

    switchFormModal();
  };

  document.addEventListener("click", handleNectarCTA);

  return () => {
    document.removeEventListener("click", handleNectarCTA);
  };
}, [locationRouter.pathname]);



  if (loading || !data) return null;

  return (
    <>
      <HeaderTemp
        data={data}
        switchFormModal={switchFormModal}
        showFormModal={showFormModal}
        setShowFormModal={setShowFormModal}
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        currentPhone={currentPhone}
        setCurrentPhone={setCurrentPhone}
        currentRegion={currentRegion}
        setCurrentRegion={setCurrentRegion}
      />

      <div className="ocm-effect-wrap">
        <div className="ocm-effect-wrap-inner">
          <div id="ajax-content-wrap">
            <div className="container-wrap">
              <div className="container main-content" role="main">
                <div className="row">
                  <Outlet context={{ homeData, currentLocation, currentRegion, layoutReady }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {regionConfig?.footer && (
        <div
          id="footer-location"
          className="full-width-section"
          style={{
            backgroundImage: `url(${regionConfig.footer.background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container">
            <div className="nectar-responsive-text font_size_desktop_31px nectar-link-underline-effect">
              <h3>{regionConfig.footer.label}</h3>
            </div>
          </div>
        </div>
      )}

      <Footer
        switchFormModal={switchFormModal}
        currentPhone={currentPhone}
        currentLocation={currentLocation}
      />
    </>
  );
}
