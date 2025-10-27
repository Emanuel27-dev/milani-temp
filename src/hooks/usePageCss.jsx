import { useEffect } from "react";

/**
 * Inyecta dinámicamente el CSS proveniente de WordPress (WPBakery + Salient)
 * en el <head> del frontend React.
 *
 * Recibe:
 * - node: objeto con los campos wpbCss, vcCustomCss, dynamicCss
 * - inlineStyles: string CSS adicional (wpbInlineStyles)
 */
export function usePageCss(node, inlineStyles) {
  useEffect(() => {
    if (!node) return;

    // 🔹 Combina todos los CSS relevantes en un solo bloque
    const combinedCss = [
      node.wpbCss,
      node.vcCustomCss,
      node.dynamicCss,
      inlineStyles,
    ]
      .filter(Boolean)
      .join("\n\n");

    if (!combinedCss) return;

    // 🔹 Crea o reemplaza un <style> único por página
    const styleId = `wp-page-css-${node.databaseId || node.id || "unknown"}`;
    let styleEl = document.getElementById(styleId);

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
    inlineStyles,
  ]);
}
