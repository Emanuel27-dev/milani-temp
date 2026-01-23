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
          opengraphImage {
            sourceUrl
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
          schema {
            raw
          }
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
          opengraphImage {
            sourceUrl
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
          schema {
            raw
          }
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
          opengraphImage {
            sourceUrl
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
          schema {
            raw
          }
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

  // ---------------------------------------------------------
  // Estados existentes (NO TOCAR)
  // ---------------------------------------------------------
  const [currentLocation, setCurrentLocation] = useState(
    localStorage.getItem("currentLocation") || "kelowna"
  );

  const [currentPhone, setCurrentPhone] = useState(
    localStorage.getItem("currentPhone") || "250.900.900"
  );

  const [currentRegion, setCurrentRegion] = useState(() => {
  const saved = localStorage.getItem("currentRegion");
  return saved && saved.length ? saved : "";
});


  const navigate = useNavigate();
  const locationRouter = useLocation();

  const regionConfig = getRegionConfig(currentRegion);


  // ---------------------------------------------------------
  // IP LOCATION (NO TOCAR)
  // ---------------------------------------------------------
  const { location, loadingLocation } = useIPLocation();

  useEffect(() => {
    if (localStorage.getItem("currentLocation")) return;
    if (loadingLocation) return;

    if (isCityInList(location.ciudad)) {
      setCurrentLocation(location.ciudad);
      localStorage.setItem("currentLocation", location.ciudad);

      const phone = getPhone(location.ciudad);
      setCurrentPhone(phone);
      localStorage.setItem("currentPhone", phone);

      const region = getRegionByCity(location.ciudad);
      setCurrentRegion(region);
      localStorage.setItem("currentRegion", region);
    } else {
      setCurrentLocation("kelowna");
      localStorage.setItem("currentLocation", "kelowna");

      setCurrentPhone("250.900.900");
      localStorage.setItem("currentPhone", "250.900.900");

      setCurrentRegion(null);
      localStorage.removeItem("currentRegion");
    }
  }, [loadingLocation, location]);

  // ---------------------------------------------------------
  // Redirección por región (NO TOCAR)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!currentRegion) return;

    if (locationRouter.state?.skipRegionRedirect) return;

    const regionSlug = currentRegion.toLowerCase().replace(/\s+/g, "");
    const pathname = locationRouter.pathname;

    if (
      pathname === `/${regionSlug}` ||
      pathname.startsWith(`/${regionSlug}/`)
    ) {
      return;
    }

    if (pathname === "/") {
      navigate(`/${regionSlug}`, { replace: true });
    }
  }, [currentRegion, locationRouter.pathname, locationRouter.state, navigate]);

  // =========================================================
  // 🟢 NUEVO: MARCAR LAYOUT COMO LISTO CUANDO LA RUTA FINAL YA EXISTE
  // =========================================================
  useEffect(() => {
    setLayoutReady(true);
  }, [locationRouter.pathname]);


useEffect(() => {
  if (!currentRegion) return;

  const regionSlug = currentRegion.toLowerCase().replace(/\s+/g, "");
  let pathname = locationRouter.pathname;

  // 1️⃣ Normalizar (quitar slash final)
  pathname = pathname.replace(/\/+$/, "");

  // 2️⃣ Si viene como /service/*
  if (pathname.startsWith("/service/")) {
    const cleanPath = pathname.replace("/service", "");
    navigate(`/${regionSlug}${cleanPath}`, {
      replace: true,
      state: { fromServiceRedirect: true },
    });
    return;
  }

  // 3️⃣ Si viene como /{region}/service/*
  if (pathname.startsWith(`/${regionSlug}/service/`)) {
    const cleanPath = pathname.replace(`/${regionSlug}/service`, `/${regionSlug}`);
    navigate(cleanPath, {
      replace: true,
      state: { fromServiceRedirect: true },
    });
  }
}, [currentRegion, locationRouter.pathname, navigate]);

useEffect(() => {
  if (!currentRegion) return;

  const regionSlug = currentRegion.toLowerCase().replace(/\s+/g, "");
  let pathname = locationRouter.pathname.replace(/\/+$/, "");

  // ignorar home
  if (pathname === "" || pathname === "/") return;

  // si ya tiene región → no tocar
  if (
    pathname === `/${regionSlug}` ||
    pathname.startsWith(`/${regionSlug}/`)
  ) {
    return;
  }

  // ignorar rutas internas técnicas
  if (
    pathname.startsWith("/wp-") ||
    pathname.startsWith("/graphql")
  ) {
    return;
  }

  // 🎯 caso: /blog, /contact, /about, /post-slug
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 1) {
    navigate(`/${regionSlug}/${parts[0]}`, {
      replace: true,
      state: { autoRegionRedirect: true },
    });
  }
}, [currentRegion, locationRouter.pathname, navigate]);

  // ---------------------------------------------------------
  // Queries existentes (NO TOCAR)
  // ---------------------------------------------------------
  const { data, loading } = useQuery(GET_HEADER, {
    fetchPolicy: "cache-first",
  });

  const { data: homeData } = useQuery(GET_HOME, {
    variables: { currentLocation },
    fetchPolicy: "cache-first",
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const switchFormModal = () => setShowFormModal(!showFormModal);

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

      {/* Estructura idéntica a Salient */}
      <div className="ocm-effect-wrap">
        <div className="ocm-effect-wrap-inner">
          <div id="ajax-content-wrap">
            <div className="container-wrap">
              <div className="container main-content" role="main">
                <div className="row">
                  <Outlet
                    context={{
                      homeData,
                      currentLocation,
                      currentRegion,
                      layoutReady, // 🟢 PASAMOS EL FLAG
                    }}
                  />
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

      <Footer switchFormModal={switchFormModal} currentPhone={currentPhone} />
    </>
  );
}