// src/hooks/useWpGlobalAssets.jsx
import { useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

/**
 * Consulta GraphQL extendida:
 * - milaniGlobals → bodyAttributes, CSS global dinámico, fuentes, custom CSS
 * - wpInlineHeadStyles → estilos inline adicionales
 * - wpDynamicInlineCss → CSS inline dinámico global
 * - enqueuedStyles → librerías CSS dinámicas (WPBakery / Salient)
 */
const GET_GLOBALS = gql`
  query GetMilaniGlobals {
    milaniGlobals {
      bodyAttributes
      salientGlobalDynamicCss
      salientFontsCss
      salientCustomCss
    }
    wpInlineHeadStyles
    wpDynamicInlineCss
    enqueuedStyles
  }
`;

/**
 * Hook que:
 * 1️⃣ Inyecta los estilos globales y dinámicos de Salient (fuentes, colores, custom CSS)
 * 2️⃣ Aplica las clases y data-attributes del <body> (igual que en WordPress)
 * 3️⃣ Agrega estilos inline globales generados por WP (wp-emoji, vc_custom-css, etc.)
 * 4️⃣ Carga las librerías CSS externas encoladas dinámicamente (Salient/WPBakery)
 * 5️⃣ Evita duplicados entre navegaciones en React
 */
export function useWpGlobalAssets() {
  const { data } = useQuery(GET_GLOBALS, {
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    if (!data) return;
    const g = data.milaniGlobals;

    // 🧩 1) Combinar todos los bloques CSS inline disponibles
    const cssBlocks = [
      g?.salientFontsCss,
      g?.salientGlobalDynamicCss,
      g?.salientCustomCss,
      data?.wpInlineHeadStyles,
      data?.wpDynamicInlineCss,
    ].filter(Boolean);

    // 🧩 2) Crear o actualizar el bloque de estilos globales únicos
    let styleEl = document.getElementById("wp-global-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "wp-global-styles";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = cssBlocks.join("\n");

    // 🧩 3) Cargar librerías externas dinámicas (como element-icon-with-text.css)
    const loadedHrefs = new Set(
      Array.from(document.querySelectorAll("link[data-wpDynamic='true']")).map(
        (el) => el.href
      )
    );

    (data?.enqueuedStyles || []).forEach((href) => {
      if (!href || loadedHrefs.has(href)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.wpDynamic = "true";
      document.head.appendChild(link);
    });

    // 🧩 4) Aplicar los bodyAttributes reales del backend
    if (g?.bodyAttributes) {
      const parser = new DOMParser();
      const tempBody = parser.parseFromString(
        `<body ${g.bodyAttributes}></body>`,
        "text/html"
      ).body;

      // Limpia atributos previos (solo class y data-*)
      [...document.body.attributes].forEach((attr) => {
        if (attr.name.startsWith("data-") || attr.name === "class") {
          document.body.removeAttribute(attr.name);
        }
      });

      // Aplica los nuevos atributos reales
      for (const attr of tempBody.attributes) {
        document.body.setAttribute(attr.name, attr.value);
      }
    }

    // 🧩 5) Limpieza al desmontar (opcional: solo los globales)
    return () => {
      const styleEl = document.getElementById("wp-global-styles");
      if (styleEl) styleEl.remove();
      // 🔸 opcional: mantener librerías externas entre rutas (no se eliminan)
    };
  }, [data]);
}
