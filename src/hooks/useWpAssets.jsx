// src/hooks/useWpAssets.jsx
import { useEffect } from "react";

/**
 * Guard global (persistente en SPA)
 */
if (typeof window !== "undefined") {
  window.__WP_ASSETS_LOADED__ = window.__WP_ASSETS_LOADED__ || false;
  window.__SALIENT_INIT__ = window.__SALIENT_INIT__ || false;
}

export function useWpAssets() {
  useEffect(() => {
    // ⛔️ Evitar doble / triple ejecución (StrictMode + SPA)
    if (window.__WP_ASSETS_LOADED__) {
      console.log("ℹ️ WP assets ya cargados, skip");
      return;
    }

    window.__WP_ASSETS_LOADED__ = true;

    const base = "https://milani.xpress.ws";
    //const base = "https://nmilani.local";

    const inject = (el) => {
      document.head.appendChild(el);
      return el;
    };

    const mkLink = (href) =>
      Object.assign(document.createElement("link"), {
        rel: "stylesheet",
        href,
      });

    const loadScript = (src, opts = {}) =>
      new Promise((resolve, reject) => {
        // ⛔️ Evitar scripts duplicados
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.defer = false;
        Object.assign(s, opts);
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });

    /* =====================================================
     * 🛡️ FIX CONTROLADO
     * Ignorar error conocido de Salient init.js en SPA reload
     * (fallback defensivo, NO soluciona el root cause)
     * ===================================================== */
    window.addEventListener("error", (e) => {
      if (
        typeof e.message === "string" &&
        e.message.includes("classList") &&
        e.filename &&
        e.filename.includes("init.js")
      ) {
        console.warn(
          "⚠️ Salient init.js classList error ignorado (SPA reload)"
        );
        e.preventDefault();
        return false;
      }
    });

    /* =====================================================
     * 🛡️ FIX REAL
     * Crear nodos mínimos que Salient espera ANTES de init.js
     * ===================================================== */
    const ensureSalientDom = () => {
      // Header bg (parallax / sticky)
      if (!document.querySelector("#page-header-bg")) {
        const el = document.createElement("div");
        el.id = "page-header-bg";
        el.setAttribute("data-parallax", "1");
        el.style.display = "none";
        document.body.appendChild(el);
      }

      // Header wrapper
      if (!document.querySelector("#header-outer")) {
        const el = document.createElement("div");
        el.id = "header-outer";
        el.style.display = "none";
        document.body.appendChild(el);
      }

      // Clase base usada por Salient
      document.body.classList.add("material");
    };

    /* ===============================
     * CSS (igual que WordPress)
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

    // ⛔️ NO se remueven estilos en SPA
    cssFiles.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        inject(mkLink(href));
      }
    });

    (async () => {
      try {
        /* ===============================
         * jQuery (solo una vez)
         * =============================== */
        if (!window.jQuery) {
          await loadScript(`${base}/wp-includes/js/jquery/jquery.min.js`);
          await loadScript(`${base}/wp-includes/js/jquery/jquery-migrate.min.js`);
          window.$ = window.jQuery;
        }

        /* ===============================
         * Globals EXACTOS de WordPress
         * =============================== */
        window.nectarLove = window.nectarLove || {
          ajaxurl: `${base}/wp-admin/admin-ajax.php`,
          rooturl: base,
        };

        window.nectarOptions = window.nectarOptions || {
          smooth_scroll: "false",
          delay_js: "false",
        };

        window.nectar_front_i18n = window.nectar_front_i18n || {
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
         * Esperar DOM REAL (WPBakery markup)
         * =============================== */
        await new Promise((resolve) => {
          const wait = () => {
            if (
              document.querySelector(".wpb-content-wrapper") ||
              document.querySelector("#ajax-content-wrap")
            ) {
              resolve();
            } else {
              requestAnimationFrame(wait);
            }
          };
          wait();
        });

        /* ===============================
         * Salient core (solo una vez)
         * =============================== */
        await loadScript(`${base}/wp-content/themes/salient/js/build/priority.js`);

        if (!window.__SALIENT_INIT__) {
          window.__SALIENT_INIT__ = true;

          // 🛡️ Esperar body listo antes de init.js
          await new Promise((resolve) => {
            const wait = () => {
              if (document.body && document.body.classList) {
                resolve();
              } else {
                requestAnimationFrame(wait);
              }
            };
            wait();
          });

          // 🛡️ FIX REAL: preparar DOM que Salient espera
          ensureSalientDom();

          // 🚀 Ahora sí es seguro ejecutar init.js
          await loadScript(`${base}/wp-content/themes/salient/js/build/init.js`);
        }

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

    /* ===============================
     * Body classes (una sola vez)
     * =============================== */
    document.body.classList.add(
      "material",
      "wpb-js-composer",
      "vc_responsive"
    );

    // ❌ NO cleanup: SPA no desmonta assets
  }, []);
}
