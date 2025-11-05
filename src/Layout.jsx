// Layout.jsx
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Outlet } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { useWpAssets } from "./hooks/useWpAssets";
import { useWpGlobalAssets } from "./hooks/useWpGlobalAssets";
import { HeaderTemp } from "./components/Header/HeaderTemp";

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
  query {
    contentNode(id: "/home/", idType: URI) {
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

  const { data, loading } = useQuery(GET_HEADER, {
    fetchPolicy: "cache-first",
  });

  // Precarga del Home (una sola vez)
  const { data: homeData } = useQuery(GET_HOME, {
    fetchPolicy: "cache-first",
  })


  if(loading || !data) return null; //evita mostrar el body sin Header

  return (
    <>
      <HeaderTemp data={data}/>

      {/* Estructura idéntica a Salient */}
      <div className="ocm-effect-wrap">
        <div className="ocm-effect-wrap-inner">
          <div id="ajax-content-wrap">
            <div className="container-wrap">
              <div className="container main-content" role="main">
                <div className="row">
                  <Outlet context={{ homeData }} /> {/* aquí entra <WpPage /> */}
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
