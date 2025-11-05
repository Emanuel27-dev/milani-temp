// src/pages/WpPage.jsx
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
  const { homeData } = useOutletContext() || {}; // 🟩 viene desde Layout.jsx

  const autoUri = pathname.endsWith("/") ? pathname : pathname + "/";
  const uri = fixedUri ?? (fixedSlug ? `/${fixedSlug}/` : autoUri);

  // 🟩 Detectar si estamos en la página de inicio
  const isHome =
    pathname === "/" || pathname === "/home/" || pathname === "/home";

  // 1️⃣ Primera consulta: contenido base
  const { data, loading, error } = useQuery(NODE_BY_PATH, {
    variables: { uri, id: 0 },
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

  const safeHtml = DOMPurify.sanitize(node.contentRendered || "");

  return (
    <article
      key={node?.id}
      className="wpb-content-wrapper"
      dangerouslySetInnerHTML={{ __html: node?.contentRendered || ""}}
    />
  );
}
