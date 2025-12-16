// src/pages/WpPage.jsx
import { Helmet } from "react-helmet-async";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useLocation, useOutletContext } from "react-router-dom";
import DOMPurify from "dompurify";
import { useEffect } from "react";

// 🔹 Hooks personalizados
import { useWpGlobalAssets } from "./hooks/useWpGlobalAssets";
import { useWpBodyAttributesFromWp } from "./hooks/useWpBodyAttributesFromWp";
import { usePageCss } from "./hooks/usePageCss";
import { useWpReflow } from "./hooks/useWpReflow";

// =========================================================
// 🔹 QUERY PRINCIPAL UNIVERSAL (Page, Post, Service, Property…)
// =========================================================
const NODE_BY_PATH = gql`
  query NodeByPath($uri: ID!, $id: Int) {
    contentNode(id: $uri, idType: URI) {
      __typename
      id
      databaseId
      uri
      slug

      # --- Page ---
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

      # --- Post ---
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

      # --- Service ---
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

    # Atributos y estilos inline del body
    bodyAttributes
    wpbInlineStyles(id: $id)
  }
`;

// =========================================================
// 🔹 COMPONENTE PRINCIPAL
// =========================================================
export function WpPage({ fixedUri, fixedSlug }) {
  const { pathname } = useLocation();
  const { homeData, currentLocation } = useOutletContext() || {}; // 🟩 viene desde Layout.jsx

  const REGIONS = ["okanagan", "alberta", "lowermainland"];


  // const autoUri = pathname.endsWith("/") ? pathname : pathname + "/";
  const cleanPathname = (() => {
  const parts = pathname.split("/").filter(Boolean);

  // si el primer segmento es una región, la quitamos
  if (REGIONS.includes(parts[0])) {
    parts.shift();
  }

  return "/" + parts.join("/") + "/";
})();

  const uri = fixedUri ?? (fixedSlug ? `/${fixedSlug}/` : cleanPathname);

  // 🟩 Detectar si estamos en la página de inicio
  const isHome =
    pathname === "/" || pathname === "/home/" || pathname === "/home";

  // 1️⃣ Primera consulta: contenido base
  const { data, loading, error } = useQuery(NODE_BY_PATH, {
    variables: { uri, id: 0, city: currentLocation },
    fetchPolicy: isHome ? "cache-first" : "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: isHome && homeData, // ⏩ no hace query si ya tenemos data precargada
  });

  // 🟩 Selecciona la fuente de datos: precargada o desde la query
  const node = isHome
    ? homeData?.contentNode || data?.contentNode
    : data?.contentNode;
  const dbId = node?.databaseId ?? 0;

  // 2️⃣ Segunda consulta: estilos inline por databaseId
  const { data: inlineData } = useQuery(NODE_BY_PATH, {
    variables: { uri, id: dbId },
    skip: !dbId,
    fetchPolicy: "cache-first",
  });

  // 3️⃣ Actualiza el título del documento
  useEffect(() => {
    if (isHome) {
      document.title = "Milani Plumbing Heating & Air Conditioning";
    } else if (node?.title) {
      document.title = `${node.title} – Milani Plumbing Heating & Air Conditioning`;
    }
  }, [node?.title, pathname]);

  useEffect(() => {
    if (node?.seo) {
      // console.log("🧠 SEO data ready for Helmet:", node.seo.title);
    }
  }, [node?.seo]);

  // 4️⃣ Hooks visuales (no se tocan)
  useWpGlobalAssets();
  useWpBodyAttributesFromWp({ data: inlineData || data });
  usePageCss(
    {
      ...node,
      inlineDynamicCss:
        node?.inlineDynamicCss || inlineData?.contentNode?.inlineDynamicCss,
    },
    inlineData?.wpbInlineStyles
  );
  useWpReflow([node?.id]);

  // 5️⃣ Renderizado
  if (error) return <p>Error cargando el contenido.</p>;
  if (!node) return <p></p>;

  // const safeHtml = DOMPurify.sanitize(node.contentRendered || "");

  // console.log("SEO: ", node.seo);
  // console.log("🔍 Helmet test", {
  //   loading,
  //   hasSEO: !!node?.seo,
  //   title: node?.seo?.title,
  // });

  return (
    <>
      {/* 🔹 Inyección dinámica de metadatos SEO */}
      {!loading && node?.seo && (
        <Helmet key={node?.id || node?.uri}>
          {/* <title>{node.seo.title || node.title}</title> reescribe el titulo que ya estaba definido en el effect */}

          {node.seo.metaDesc && (
            <meta name="description" content={node.seo.metaDesc} />
          )}

          {node.seo.canonical && (
            <link rel="canonical" href={node.seo.canonical} />
          )}

          {node.seo.opengraphTitle && (
            <meta property="og:title" content={node.seo.opengraphTitle} />
          )}
          {node.seo.opengraphDescription && (
            <meta
              property="og:description"
              content={node.seo.opengraphDescription}
            />
          )}
          {node.seo.opengraphImage?.sourceUrl && (
            <meta
              property="og:image"
              content={node.seo.opengraphImage.sourceUrl}
            />
          )}
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={node.seo.canonical || window.location.href}
          />

          {node.seo.twitterTitle && (
            <meta name="twitter:title" content={node.seo.twitterTitle} />
          )}
          {node.seo.twitterDescription && (
            <meta
              name="twitter:description"
              content={node.seo.twitterDescription}
            />
          )}
          {node.seo.twitterImage?.sourceUrl && (
            <meta
              name="twitter:image"
              content={node.seo.twitterImage.sourceUrl}
            />
          )}
          <meta name="twitter:card" content="summary_large_image" />

          {node.seo.schema?.raw && (
            <script type="application/ld+json">{node.seo.schema.raw}</script>
          )}
        </Helmet>
      )}

      {/* 🔹 Contenido principal */}
      
      {/* {!loading && isHome && <CityGlobalSection />} */}

      <article
        key={node?.id}
        className="wpb-content-wrapper"
        dangerouslySetInnerHTML={{ __html: node?.contentRendered || "" }}
      />
    </>
  );
}
