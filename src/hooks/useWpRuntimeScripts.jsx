// src/hooks/useWpRuntimeScripts.js
import { useEffect, useRef } from "react";

export function useWpRuntimeScripts(scripts = []) {
  const loaded = useRef(new Set());

  useEffect(() => {
    if (!scripts || !scripts.length) return;

    const loadScript = (html) =>
      new Promise((resolve) => {
        // Extraer src
        const match = html.match(/src="([^"]+)"/);
        if (!match) return resolve();

        const src = match[1];
        if (loaded.current.has(src)) return resolve();

        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.defer = false;

        s.onload = () => {
          loaded.current.add(src);
          resolve();
        };

        document.body.appendChild(s);
      });

    (async () => {
      for (const script of scripts) {
        await loadScript(script);
      }

      // 🔥 RE-INIT Salient / WPBakery
      setTimeout(() => {
        window.jQuery?.(document).trigger("vc_reload");
        window.jQuery?.(window).trigger("resize");

        if (window.Nectar && typeof window.Nectar.init === "function") {
          window.Nectar.init();
        }
      }, 50);
    })();
  }, [scripts]);
}
