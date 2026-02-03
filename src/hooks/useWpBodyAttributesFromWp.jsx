// src/hooks/useWpBodyAttributesFromWp.js
import { useEffect } from "react";

/**
 * ✅ Sincroniza las clases y data-* del <body> obtenidas desde GraphQL (bodyAttributes)
 *
 * ⚠️ IMPORTANTE (Salient + SPA):
 * - El <body> SOLO debe sincronizarse UNA VEZ
 * - Salient guarda referencias internas al body en init.js
 * - Volver a limpiar/reaplicar clases rompe sliders y animaciones
 */
export function useWpBodyAttributesFromWp({ data }) {
  useEffect(() => {
    if (!data?.bodyAttributes) return;

    // 🛡️ Evitar re-sincronización en SPA / reload
    if (window.__WP_BODY_SYNC_DONE__) {
      console.log("ℹ️ Body ya sincronizado, skip");
      return;
    }

    window.__WP_BODY_SYNC_DONE__ = true;

    try {
      // --- 1️⃣ Normalizar la cadena HTML ---
      const attrs = data.bodyAttributes
        .replace(/\\\"/g, '"') // elimina escapes
        .replace(/\s{2,}/g, " ")
        .trim();

      // --- 2️⃣ Parsear atributos del body remoto ---
      const parser = new DOMParser();
      const temp = parser.parseFromString(
        `<body ${attrs}></body>`,
        "text/html"
      );
      const newBody = temp.body;

      if (!newBody) return;

      // --- 3️⃣ Limpiar SOLO en la primera carga ---
      // (después de init.js NO se debe tocar el body)
      [...document.body.attributes].forEach((attr) => {
        if (attr.name === "class" || attr.name.startsWith("data-")) {
          document.body.removeAttribute(attr.name);
        }
      });

      // --- 4️⃣ Aplicar los nuevos atributos ---
      for (const attr of newBody.attributes) {
        document.body.setAttribute(attr.name, attr.value);
      }

      console.log(
        "✅ Body sincronizado desde WordPress:",
        newBody.getAttribute("class") || ""
      );

      // --- 5️⃣ Disparar reflow visual mínimo (seguro) ---
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
    } catch (err) {
      console.warn("⚠️ Error aplicando bodyAttributes:", err);
    }
  }, [data?.bodyAttributes]);
}
