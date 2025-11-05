// src/hooks/useWpAssets.js
import { useEffect } from "react";

export function useWpAssets() {
  useEffect(() => {
    const base = "https://milani.xpress.ws";
    // const base = "https://milani.local"

    // === Helpers ===
    const inject = (el) => {
      document.head.appendChild(el);
      return () => el.remove();
    };

    const mkLink = (href) =>
      Object.assign(document.createElement("link"), {
        rel: "stylesheet",
        href,
      });

    const mkScript = (src, opts = { defer: true }) =>
      Object.assign(document.createElement("script"), { src, ...opts });

    const loadScript = (src, opts = { defer: true }) =>
      new Promise((resolve, reject) => {
        const s = mkScript(src, opts);
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });

    // === CSS global (TODOS los originales) ===
    const cssFiles = [
      // --- SALIENT (tema principal + hijo) ---
      `${base}/wp-content/themes/salient/style.css`,
      `${base}/wp-content/themes/salient-child/style.css`,

      // --- Core del tema y layout ---
      `${base}/wp-content/themes/salient/css/build/grid-system.css`,
      `${base}/wp-content/themes/salient/css/build/style.css`,
      `${base}/wp-content/themes/salient/css/build/style-non-critical.css`,
      `${base}/wp-content/themes/salient/css/build/responsive.css`,
      `${base}/wp-content/themes/salient/css/build/skin-material.css`,

      // --- Estilos dinámicos generados por el panel ---
      `${base}/wp-content/themes/salient/css/salient-dynamic-styles.css?ver=${Math.floor(
        Math.random() * 99999
      )}`,
      `${base}/wp-content/uploads/salient/menu-dynamic.css`,

      // --- Fuentes e iconos ---
      "https://fonts.googleapis.com/css?family=Archivo:400,700",
      `${base}/wp-content/themes/salient/css/font-awesome-legacy.min.css`,

      // --- Componentes adicionales de Salient ---
      `${base}/wp-content/themes/salient/css/build/plugins/jquery.fancybox.css`,
      `${base}/wp-content/themes/salient/css/build/off-canvas/core.css`,
      `${base}/wp-content/themes/salient/css/build/off-canvas/slide-out-right-material.css`,
      `${base}/wp-content/themes/salient/css/build/off-canvas/slide-out-right-hover.css`,

      // --- WPBakery (page builder) ---
      `${base}/wp-content/themes/salient/css/build/plugins/js_composer.css`,
      `${base}/wp-content/plugins/js_composer_salient/assets/css/js_composer.min.css`,
    ];

    const cssRemovers = cssFiles.map((href) => inject(mkLink(href)));

    // === Carga JS secuencial ===
    (async () => {
      try {
        // 1️⃣ jQuery base primero (sin defer)
        await loadScript(`${base}/wp-includes/js/jquery/jquery.min.js`, {
          defer: false,
        });
        await loadScript(`${base}/wp-includes/js/jquery/jquery-migrate.min.js`, {
          defer: false,
        });

        // Forzar jQuery global
        window.$ = window.jQuery = window.jQuery || window.$;

        // 2️⃣ Librerías de terceros (todas las que tenías originalmente)
        await loadScript(
          `${base}/wp-content/themes/salient/js/build/third-party/jquery.easing.min.js`
        );
        await loadScript(
          `${base}/wp-content/themes/salient/js/build/third-party/jquery.mousewheel.min.js`
        );
        await loadScript(
          `${base}/wp-content/themes/salient/js/build/third-party/transit.min.js`
        );
        await loadScript(
          `${base}/wp-content/themes/salient/js/build/third-party/waypoints.js`
        );
        await loadScript(
          `${base}/wp-content/themes/salient/js/build/third-party/imagesLoaded.min.js`
        );
        await loadScript(
          `${base}/wp-content/themes/salient/js/build/third-party/hoverintent.min.js`
        );
        await loadScript(
          `${base}/wp-content/themes/salient/js/build/third-party/jquery.fancybox.js`
        );
        await loadScript(
          `${base}/wp-content/themes/salient/js/build/third-party/anime.min.js`
        );
        await loadScript(
          `${base}/wp-content/themes/salient/js/build/third-party/superfish.js`
        );

        // 3️⃣ Núcleo del tema
        await loadScript(`${base}/wp-content/themes/salient/js/build/priority.js`);
        await loadScript(`${base}/wp-content/themes/salient/js/build/init.js`);

        // 4️⃣ WPBakery (interactividad del builder)
        await loadScript(
          `${base}/wp-content/plugins/js_composer_salient/assets/js/dist/js_composer_front.min.js?ver=7.8.1`
        );
      } catch (err) {
        console.warn("Error cargando asset:", err);
      }
    })();

    // === Clases necesarias para layout ===
    const bodyCls = ["material", "wpb-js-composer", "vc_responsive"];
    document.body.classList.add(...bodyCls);

    // === Limpieza al desmontar ===
    return () => {
      cssRemovers.forEach((r) => r());
      document.body.classList.remove(...bodyCls);
    };
  }, []);
}
