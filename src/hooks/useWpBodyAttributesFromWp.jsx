// src/hooks/useWpBodyAttributesFromWp.js
import { useEffect } from "react";

/**
 * ✅ Sincroniza las clases y data-* del <body> obtenidas desde GraphQL (bodyAttributes)
 * - Limpia solo los atributos previos relacionados con WordPress/Salient
 * - Aplica los nuevos valores (clases + data-*)
 * - No ejecuta scripts (eso lo hace useWpReflow)
 */
export function useWpBodyAttributesFromWp({ data }) {
  useEffect(() => {
    if (!data?.bodyAttributes) return;

    try {
      // --- 1️⃣ Normalizar la cadena HTML ---
      const attrs = data.bodyAttributes
        .replace(/\\\"/g, '"') // elimina escapes
        .replace(/\s{2,}/g, " ")
        .trim();

      // --- 2️⃣ Parsear atributos del body remoto ---
      const parser = new DOMParser();
      const temp = parser.parseFromString(`<body ${attrs}></body>`, "text/html");
      const newBody = temp.body;

      if (!newBody) return;

      // --- 3️⃣ Limpiar solo los atributos relevantes ---
      [...document.body.attributes].forEach((attr) => {
        if (attr.name.startsWith("data-") || attr.name === "class") {
          document.body.removeAttribute(attr.name);
        }
      });

      // --- 4️⃣ Aplicar los nuevos atributos ---
      for (const attr of newBody.attributes) {
        document.body.setAttribute(attr.name, attr.value);
      }

      console.log(
        "✅ Body actualizado desde WordPress:",
        newBody.getAttribute("class") || ""
      );

      // --- 5️⃣ Disparar reflow visual básico ---
      ["resize", "scroll", "load"].forEach((evt) =>
        window.dispatchEvent(new Event(evt))
      );
    } catch (err) {
      console.warn("⚠️ Error aplicando bodyAttributes:", err);
    }
  }, [data?.bodyAttributes]);
}
