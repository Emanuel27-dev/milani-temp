// src/pages/WpPage.jsx
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";

// 🔹 Hooks personalizados
import { useWpGlobalAssets } from "./hooks/useWpGlobalAssets";   // estilos globales + body inicial
import { useWpBodyAttributesFromWp } from "./hooks/useWpBodyAttributesFromWp"; // body dinámico por página
import { usePageCss } from "./hooks/usePageCss";                 // CSS dinámico (WPBakery + Salient)
import { useWpReflow } from "./hooks/useWpReflow";               // reactivación de scripts y animaciones

// 🔹 Query principal
const NODE_BY_PATH = gql`
  query NodeByPath($uri: ID!, $id: Int) {
    contentNode(id: $uri, idType: URI) {
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
    }
    bodyAttributes
    wpbInlineStyles(id: $id)
  }
`;

export function WpPage({ fixedUri, fixedSlug }) {
  const { pathname } = useLocation();
  const autoUri = pathname.endsWith("/") ? pathname : pathname + "/";
  const uri = fixedUri ?? (fixedSlug ? `/${fixedSlug}/` : autoUri);

  /* -------------------------------------------------------------
   * 1️⃣ Primera consulta: obtiene la página base (sin inlineStyles)
   * ------------------------------------------------------------- */
  const { data, loading, error } = useQuery(NODE_BY_PATH, {
    variables: { uri, id: 0 },
    fetchPolicy: "network-only",
  });

  const node = data?.contentNode;
  const dbId = node?.databaseId ?? 0;

  /* -------------------------------------------------------------
   * 2️⃣ Segunda consulta: obtiene inlineStyles usando el databaseId
   * ------------------------------------------------------------- */
  const { data: inlineData } = useQuery(NODE_BY_PATH, {
    variables: { uri, id: dbId },
    skip: !dbId,
    fetchPolicy: "network-only",
  });

  /* -------------------------------------------------------------
   * 3️⃣ Hooks de sincronización visual
   * ------------------------------------------------------------- */

  // 🔹 Cargar estilos globales (solo una vez, theme Salient)
  useWpGlobalAssets();

  // 🔹 Actualizar body attributes específicos de la página
  useWpBodyAttributesFromWp({ data: inlineData || data });

  // 🔹 Inyectar CSS dinámico (WPBakery / Salient + CSS inline por página)
  usePageCss(
    {
      ...node,
      inlineDynamicCss: node?.inlineDynamicCss || inlineData?.contentNode?.inlineDynamicCss,
    },
    inlineData?.wpbInlineStyles
  );

  // 🔹 Reactivar scripts, animaciones y sliders de WPBakery / Salient
  useWpReflow([node?.id]);

  /* -------------------------------------------------------------
   * 4️⃣ Renderizado seguro del contenido
   * ------------------------------------------------------------- */

  if (loading) return null;
  if (error) return <p>Error cargando el contenido</p>;
  if (!node) return <p>Página no encontrada</p>;

  // Limpieza de contenido (seguridad)
  const safeHtml = DOMPurify.sanitize(node.contentRendered || "");

  return (
    <article
      key={node?.id}
      className="wpb-content-wrapper"
      dangerouslySetInnerHTML={{ __html: node?.contentRendered || "" }}
    />
  );
}
