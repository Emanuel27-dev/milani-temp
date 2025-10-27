// src/hooks/useWpGlobalAssets.js
import { useEffect } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

/**
 * Consulta global de GraphQL para obtener:
 * - bodyAttributes: clases y data-attributes del <body>
 * - salientGlobalDynamicCss: CSS dinámico principal del tema Salient
 * - salientFontsCss: tipografías personalizadas del panel Salient
 * - salientCustomCss: CSS global definido en el panel de opciones
 */
const GET_GLOBALS = gql`
  query GetMilaniGlobals {
    milaniGlobals {
      bodyAttributes
      salientGlobalDynamicCss
      salientFontsCss
      salientCustomCss
    }
  }
`;

/**
 * Hook que:
 * 1️⃣ Inyecta los estilos globales de Salient (fuentes, colores, custom CSS)
 * 2️⃣ Aplica las clases y data-attributes del <body>
 */
export function useWpGlobalAssets() {
  const { data } = useQuery(GET_GLOBALS, {
    fetchPolicy: "cache-first", // evita recargar en cada ruta
  });

  useEffect(() => {
    if (!data?.milaniGlobals) return;
    const g = data.milaniGlobals;

    // 🧩 1) Combinar CSS global
    const cssBlocks = [
      g.salientFontsCss,
      g.salientGlobalDynamicCss,
      g.salientCustomCss,
    ].filter(Boolean);

    if (cssBlocks.length > 0) {
      // Si no existe aún el <style>, créalo
      let styleEl = document.getElementById("wp-global-styles");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "wp-global-styles";
        document.head.appendChild(styleEl);
      }

      // Actualiza el contenido
      styleEl.textContent = cssBlocks.join("\n");
    }

    // 🧩 2) Aplicar clases y data-* del body (desde Salient)
    if (g.bodyAttributes) {
      const parser = new DOMParser();
      const tempBody = parser.parseFromString(
        `<body ${g.bodyAttributes}></body>`,
        "text/html"
      ).body;

      // Limpia atributos previos relacionados con Salient
      [...document.body.attributes].forEach((attr) => {
        if (attr.name.startsWith("data-") || attr.name === "class") {
          document.body.removeAttribute(attr.name);
        }
      });

      // Aplica los nuevos atributos
      for (const attr of tempBody.attributes) {
        document.body.setAttribute(attr.name, attr.value);
      }
    }

    // 🧩 Limpieza opcional (si desmontas Layout)
    return () => {
      // No quitamos el body attributes porque pueden ser usados globalmente
      const styleEl = document.getElementById("wp-global-styles");
      if (styleEl) styleEl.remove();
    };
  }, [data]);
}
