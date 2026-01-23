// src/hooks/useWpAssets.js
import { useEffect } from "react";

export function useWpAssets() {
  useEffect(() => {
    const base = "https://milani.xpress.ws";
    //const base = "https://nmilani.local";

    const inject = (el) => {
      document.head.appendChild(el);
      return () => el.remove();
    };

    const mkLink = (href) =>
      Object.assign(document.createElement("link"), {
        rel: "stylesheet",
        href,
      });

    const loadScript = (src, opts = {}) =>
      new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.defer = false;
        Object.assign(s, opts);
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });

    /* ===============================
     * CSS (igual que WP)
     * =============================== */
    const cssFiles = [
      `${base}/wp-content/themes/salient/style.css`,
      `${base}/wp-content/themes/salient-child/style.css`,
      `${base}/wp-content/themes/salient/css/build/grid-system.css`,
      `${base}/wp-content/themes/salient/css/build/style.css`,
      `${base}/wp-content/themes/salient/css/build/style-non-critical.css`,
      `${base}/wp-content/themes/salient/css/build/responsive.css`,
      `${base}/wp-content/themes/salient/css/build/skin-material.css`,
      `${base}/wp-content/themes/salient/css/build/plugins/flickity.css`,
      `${base}/wp-content/themes/salient/css/build/plugins/jquery.fancybox.css`,
      `${base}/wp-content/uploads/salient/menu-dynamic.css`,
      `${base}/wp-content/themes/salient/css/font-awesome-legacy.min.css`,
      "https://fonts.googleapis.com/css?family=Archivo:400,700",
    ];

    const cssRemovers = cssFiles.map((href) => inject(mkLink(href)));

    (async () => {
      try {
        /* ===============================
         * jQuery
         * =============================== */
        await loadScript(`${base}/wp-includes/js/jquery/jquery.min.js`);
        await loadScript(`${base}/wp-includes/js/jquery/jquery-migrate.min.js`);
        window.$ = window.jQuery;

        /* ===============================
         * Globals EXACTOS de WordPress
         * =============================== */
        window.nectarLove = {
          ajaxurl: `${base}/wp-admin/admin-ajax.php`,
          rooturl: base,
        };

        window.nectarOptions = {
          smooth_scroll: "false",
          delay_js: "false",
        };

        window.nectar_front_i18n = {
          next: "Next",
          previous: "Previous",
          close: "Close",
        };

        /* ===============================
         * Third-party (ORDEN CRÍTICO)
         * =============================== */
        await loadScript(`${base}/wp-content/themes/salient/js/build/third-party/jquery.easing.min.js`);
        await loadScript(`${base}/wp-content/themes/salient/js/build/third-party/jquery.mousewheel.min.js`);
        await loadScript(`${base}/wp-content/themes/salient/js/build/third-party/transit.min.js`);
        await loadScript(`${base}/wp-content/themes/salient/js/build/third-party/waypoints.js`);
        await loadScript(`${base}/wp-content/themes/salient/js/build/third-party/imagesLoaded.min.js`);
        await loadScript(`${base}/wp-content/themes/salient/js/build/third-party/hoverintent.min.js`);
        await loadScript(`${base}/wp-content/themes/salient/js/build/third-party/jquery.fancybox.js`);
        await loadScript(`${base}/wp-content/themes/salient/js/build/third-party/anime.min.js`);
        await loadScript(`${base}/wp-content/themes/salient/js/build/third-party/flickity.js`);
        await loadScript(`${base}/wp-content/themes/salient/js/build/third-party/superfish.js`);

        /* ===============================
         * Esperar DOM REAL
         * =============================== */
        await new Promise((resolve) => {
          const wait = () => {
            if (
              document.querySelector("#ajax-content-wrap") &&
              document.querySelector(".wpb-content-wrapper")
            ) {
              resolve();
            } else {
              requestAnimationFrame(wait);
            }
          };
          wait();
        });

        /* ===============================
         * Salient core
         * =============================== */
        await loadScript(`${base}/wp-content/themes/salient/js/build/priority.js`);
        await loadScript(`${base}/wp-content/themes/salient/js/build/init.js`);

        /* ===============================
         * WPBakery
         * =============================== */
        await loadScript(
          `${base}/wp-content/plugins/js_composer_salient/assets/js/dist/js_composer_front.min.js`
        );

        console.log("✅ Salient + WPBakery assets cargados correctamente");
      } catch (err) {
        console.error("❌ Error cargando assets:", err);
      }
    })();

    document.body.classList.add("material", "wpb-js-composer", "vc_responsive");

    return () => {
      cssRemovers.forEach((r) => r());
      document.body.classList.remove("material", "wpb-js-composer", "vc_responsive");
    };
  }, []);
}
