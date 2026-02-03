// src/hooks/usePageCss.jsx
import { useEffect } from "react";

/**
 * Inyecta dinámicamente el CSS proveniente de WordPress (WPBakery + Salient)
 * en el <head> del frontend React.
 *
 * Recibe:
 * - node: objeto con los campos wpbCss, vcCustomCss, dynamicCss, inlineDynamicCssGrouped
 * - inlineStyles: string CSS adicional (wpbInlineStyles)
 */
export function usePageCss(node, inlineStyles) {
  useEffect(() => {
    if (!node) return;

    // 🧩 Combina todos los CSS relevantes de la página + Salient en un solo bloque
    const cssParts = [
      node.wpbCss,
      node.vcCustomCss,
      node.dynamicCss,
      inlineStyles,
      node.inlineDynamicCssGrouped?.emoji,
      node.inlineDynamicCssGrouped?.global,
      node.inlineDynamicCssGrouped?.main,
      node.inlineDynamicCssGrouped?.dynamic,
      node.inlineDynamicCssGrouped?.file,
    ].filter(Boolean);

    if (!cssParts.length) return;

    const combinedCss = cssParts.join("\n\n");

    // 🔹 ID único por página para evitar conflictos o duplicados
    const styleId = `wp-page-css-${node.databaseId || node.id || "unknown"}`;
    let styleEl = document.getElementById(styleId);

    // 🔹 Crea el <style> si no existe
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    // 🔹 Actualiza el contenido CSS (usa textContent para evitar reflow innecesario)
    styleEl.textContent = combinedCss;

    // 🔹 Limpieza: elimina los estilos al desmontar o cambiar de página
    return () => {
      const old = document.getElementById(styleId);
      if (old) old.remove();
    };
  }, [
    node?.id,
    node?.databaseId,
    node?.wpbCss,
    node?.vcCustomCss,
    node?.dynamicCss,
    node?.inlineDynamicCssGrouped,
    inlineStyles,
  ]);
}
