// Layout.jsx
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

  // asigna a currentLocation la ciudad selecionada que estará almacenada en el localStorage y por defecto es kelowna
  const [currentLocation, setCurrentLocation] = useState(
    localStorage.getItem("currentLocation") || "kelowna"
  );

  const [currentPhone, setCurrentPhone] = useState(
    localStorage.getItem("currentPhone") || "250.900.900"
  );

  const [currentRegion, setCurrentRegion] = useState(
    localStorage.getItem("currentRegion") || ""
  )


  const navigate = useNavigate();
  const locationRouter = useLocation();

  // AGREGANDO IP LOCATION Y USEEFFECT
  const { location, loadingLocation } = useIPLocation();

  useEffect(() => {
    // Si ya existe ciudad guardada, no tocar nada
    if (localStorage.getItem("currentLocation")) return;

    // Esperamos a que termine la llamada a la API
    if (loadingLocation) return;

    // verificar si esta ciudad se encuentra en la "base de datos", si esta mostramos si no, mostramos kelowna
    if(isCityInList(location.ciudad)) {
      console.log('SE HA ENCONTRADO .. la ciudad')
        setCurrentLocation(location.ciudad);
        localStorage.setItem("currentLocation", location.ciudad);

        const phone = getPhone(location.ciudad);
        setCurrentPhone(phone);
        localStorage.setItem("currentPhone", phone);

        const region = getRegionByCity(location.ciudad);
        setCurrentRegion(region);
        localStorage.setItem("currentRegion", region);
    }
    else {
       console.log('NO SE HA ENCONTRADO .. la ciudad')
        setCurrentLocation("kelowna");
        localStorage.setItem("currentLocation", "kelowna");
        setCurrentPhone("250.900.900");
        localStorage.setItem("currentPhone", "250.900.900");
        // setCurrentRegion("Okanagan");
        // localStorage.setItem("currentRegion", "Okanagan");

        setCurrentRegion(null);
        localStorage.removeItem("currentRegion");
    }
  }, [loadingLocation, location]);



useEffect(() => {
  if (!currentRegion) return;
    // 🚫 Si el usuario vino explícitamente al home (logo)
  if (locationRouter.state?.skipRegionRedirect) {
    return;
  }


  const regionSlug = currentRegion.toLowerCase().replace(/\s+/g, '');

  // pathname actual
  const pathname = locationRouter.pathname;

  // si ya estamos en /alberta, /okanagan, etc → NO hacer nada
  if (pathname === `/${regionSlug}` || pathname.startsWith(`/${regionSlug}/`)) {
    return;
  }

  // SOLO si estamos en la raíz "/"
  if (pathname === "/") {
    navigate(`/${regionSlug}`, { replace: true });
  }
}, [currentRegion, locationRouter.pathname, locationRouter.state ,navigate]);



  const { data, loading } = useQuery(GET_HEADER, {
    fetchPolicy: "cache-first",
  });

  // Precarga del Home (una sola vez)
  // const { data: homeData } = useQuery(GET_HOME, {
  //   fetchPolicy: "cache-first",
  // })

  const { data: homeData } = useQuery(GET_HOME, {
    variables: { currentLocation },
    fetchPolicy: "cache-first",
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const switchFormModal = () => {
    setShowFormModal(!showFormModal);
  };

  if (loading || !data) return null; //evita mostrar el body sin Header

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
                  <Outlet context={{ homeData, currentLocation, currentRegion }} />{" "}
                  {/* aquí entra <WpPage /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer switchFormModal={switchFormModal} currentPhone={currentPhone} />
    </>
  );
}
