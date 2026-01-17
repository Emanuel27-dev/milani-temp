import { useEffect } from "react";

export default function useIframeReflow(html) {
  useEffect(() => {
    if (!html) return;

    // Esperar a que el DOM esté realmente pintado
    requestAnimationFrame(() => {
      const iframes = document.querySelectorAll("iframe");

      iframes.forEach((iframe) => {
        const src = iframe.getAttribute("src");
        if (!src) return;

        // 🔁 Fuerza re-creación del iframe
        iframe.setAttribute("src", src);
      });
    });
  }, [html]);
}
