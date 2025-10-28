// src/pages/WpPage.jsx
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import { useEffect } from "react";

// 🔹 Hooks personalizados
import { useWpGlobalAssets } from "./hooks/useWpGlobalAssets"; // estilos globales + body inicial
import { useWpBodyAttributesFromWp } from "./hooks/useWpBodyAttributesFromWp"; // body dinámico por página
import { usePageCss } from "./hooks/usePageCss"; // CSS dinámico (WPBakery + Salient)
import { useWpReflow } from "./hooks/useWpReflow"; // reactivación de scripts y animaciones


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
  const autoUri = pathname.endsWith("/") ? pathname : pathname + "/";
  const uri = fixedUri ?? (fixedSlug ? `/${fixedSlug}/` : autoUri);

  // 1️⃣ Primera consulta (contenido base)
  const { data, loading, error } = useQuery(NODE_BY_PATH, {
    variables: { uri, id: 0 },
    fetchPolicy: "network-only",
  });

  const node = data?.contentNode;
  const dbId = node?.databaseId ?? 0;

  // 2️⃣ Actualizar el título de la pestaña según la página
  useEffect(() => {
    const isHome =
      pathname === "/" || pathname === "/home/" || pathname === "/home";

    if (isHome) {
      document.title = "Milani Plumbing Heating & Air Conditioning";
    } else if (node?.title) {
      document.title = `${node.title} – Milani Plumbing Heating & Air Conditioning`;
    }
  }, [node?.title, pathname]);

  // 3️⃣ Segunda consulta: inline styles (por databaseId)
  const { data: inlineData } = useQuery(NODE_BY_PATH, {
    variables: { uri, id: dbId },
    skip: !dbId,
    fetchPolicy: "network-only",
  });

  // 4️⃣ Hooks visuales sincronizados
  useWpGlobalAssets(); // Carga global (Salient base)
  useWpBodyAttributesFromWp({ data: inlineData || data }); // Actualiza <body>
  usePageCss(
    {
      ...node,
      inlineDynamicCss:
        node?.inlineDynamicCss || inlineData?.contentNode?.inlineDynamicCss,
    },
    inlineData?.wpbInlineStyles
  );
  useWpReflow([node?.id]); // Reactiva scripts, sliders, animaciones

  // 5️⃣ Renderizado
  if (loading) return null;
  if (error) return <p>Error cargando el contenido.</p>;
  if (!node) return <p>Página no encontrada.</p>;

  const safeHtml = DOMPurify.sanitize(node.contentRendered || "");

  return (
    <article
      key={node?.id}
      className="wpb-content-wrapper"
      dangerouslySetInnerHTML={{ __html: node?.contentRendered || "" }}
    />
  );
}
