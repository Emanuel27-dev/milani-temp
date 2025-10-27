import { useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

/**
 * Consulta GraphQL extendida:
 * - milaniGlobals → bodyAttributes, CSS global dinámico, fuentes, custom CSS
 * - wpInlineHeadStyles → estilos inline adicionales (wp-emoji, global, vc_custom-css, etc.)
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
  }
`;

/**
 * Hook que:
 * 1️⃣ Inyecta los estilos globales y dinámicos de Salient (fuentes, colores, custom CSS)
 * 2️⃣ Aplica las clases y data-attributes del <body> (igual que en WordPress)
 * 3️⃣ Agrega estilos inline globales generados por WP (wp-emoji, vc_custom-css, etc.)
 * 4️⃣ Evita duplicados entre navegaciones en React
 */
export function useWpGlobalAssets() {
  const { data } = useQuery(GET_GLOBALS, {
    fetchPolicy: "cache-first", // evita volver a pedir en cada navegación
  });

  useEffect(() => {
    if (!data) return;
    const g = data.milaniGlobals;

    // 🧩 1) Combinar todos los bloques CSS disponibles
    const cssBlocks = [
      g?.salientFontsCss,
      g?.salientGlobalDynamicCss,
      g?.salientCustomCss,
      data?.wpInlineHeadStyles, // estilos inline globales del backend
      data?.wpDynamicInlineCss, // 👈 añade aquí
    ].filter(Boolean);

    // 🧩 2) Crear/actualizar el bloque de estilos globales (único)
    let styleEl = document.getElementById("wp-global-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "wp-global-styles";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = cssBlocks.join("\n");

    // 🧩 3) Aplicar los bodyAttributes reales del backend
    if (g?.bodyAttributes) {
      const parser = new DOMParser();
      const tempBody = parser.parseFromString(
        `<body ${g.bodyAttributes}></body>`,
        "text/html"
      ).body;

      // Limpia los atributos previos de Salient (solo class y data-*)
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

    // 🧩 4) Limpieza al desmontar Layout (remueve el <style> global)
    return () => {
      const styleEl = document.getElementById("wp-global-styles");
      if (styleEl) styleEl.remove();
    };
  }, [data]);
}
