// useWpAssets.js
import { useEffect } from "react";

const inject = (tag) => { document.head.appendChild(tag); return () => tag.remove(); };
const mkLink = (href) => Object.assign(document.createElement("link"), { rel: "stylesheet", href });
const mkScript = (src, { defer = true } = {}) =>
  Object.assign(document.createElement("script"), { src, defer });

/** Inyecta un <link> y lo borra si la URL no existe (onerror). */
function injectIfExists(href) {
  const el = mkLink(href);
  el.onerror = () => el.remove();
  return inject(el);
}

/** Carga el primer script que exista (en orden). */
async function loadSeq(urls, { defer = true } = {}) {
  for (const u of urls) {
    try {
      await new Promise((res, rej) => {
        const s = mkScript(u, { defer });
        s.onload = () => res();
        s.onerror = () => { s.remove(); rej(new Error(u)); };
        document.head.appendChild(s);
      });
      return; // cargó uno, paramos
    } catch { /* intenta siguiente */ }
  }
}

export function useWpAssets() {
  // Clases que el tema necesita en <body>
  useEffect(() => {
    const cls = ["material", "wpb-js-composer", "vc_responsive"];
    document.body.classList.add(...cls);
    return () => document.body.classList.remove(...cls);
  }, []);

  // CSS + JS del theme
  useEffect(() => {
    const base = import.meta.env.VITE_WP_BASE_URL?.replace(/\/+$/, "");
    if (!base) return;

    // ===== CSS =====
    const cleanCss = [
      // Salient core
      inject(mkLink(`${base}/wp-content/themes/salient/css/build/grid-system.css`)),
      inject(mkLink(`${base}/wp-content/themes/salient/css/build/style.css`)),
      injectIfExists(`${base}/wp-content/themes/salient/css/build/style-non-critical.css`),
      inject(mkLink(`${base}/wp-content/themes/salient/css/build/responsive.css`)),
      inject(mkLink(`${base}/wp-content/themes/salient/css/build/skin-material.css`)),

      // Algunos elementos comunes (iwithtext, cf7)
      injectIfExists(`${base}/wp-content/themes/salient/css/build/elements/element-icon-with-text.css`),
      injectIfExists(`${base}/wp-content/themes/salient/css/build/third-party/cf7.css`),

      // WPBakery
      inject(mkLink(`${base}/wp-content/themes/salient/css/build/plugins/js_composer.css`)),
      inject(mkLink(`${base}/wp-content/themes/salient/css/font-awesome-legacy.min.css`)),
      inject(mkLink(`${base}/wp-content/plugins/js_composer_salient/assets/css/js_composer.min.css`)),

      // Dinámicos del sitio
      injectIfExists(`${base}/wp-content/uploads/salient/menu-dynamic.css`),
      injectIfExists(`${base}/wp-content/themes/salient/css/salient-dynamic-styles.css?ver=${Math.round(Math.random() * 100000)}`),

      // Opcionales (por si existen)
      injectIfExists(`${base}/wp-content/themes/salient/style.css`),
      injectIfExists(`${base}/wp-content/themes/salient-child/style.css`),
    ];

    // ===== JS =====
    (async () => {
      // jQuery + migrate (sin defer)
      await loadSeq([`${base}/wp-includes/js/jquery/jquery.min.js`], { defer: false });
      await loadSeq([`${base}/wp-includes/js/jquery/jquery-migrate.min.js`], { defer: false });

      // dependencias base
      await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/imagesLoaded.min.js`]);
      await loadSeq([
        `${base}/wp-content/themes/salient/js/build/third-party/waypoints.js`,
        `${base}/wp-content/plugins/js_composer/assets/lib/waypoints/waypoints.min.js`,
      ]);

      // utilidades del theme
      await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/jquery.easing.min.js`]).catch(() => {});
      await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/transit.min.js`]).catch(() => {});
      await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/superfish.js`]).catch(() => {});
      await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/jquery.fancybox.js`]).catch(() => {});
      await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/anime.min.js`]).catch(() => {});
      await loadSeq([
        `${base}/wp-includes/js/hoverintent-js.min.js`,
        `${base}/wp-content/themes/salient/js/build/third-party/hoverintent.min.js`,
      ]).catch(() => {});
      await loadSeq([`${base}/wp-content/plugins/salient-core/js/third-party/touchswipe.min.js`]).catch(() => {});

      // núcleo del theme
      await loadSeq([`${base}/wp-content/themes/salient/js/build/priority.js`]).catch(() => {});
      await loadSeq([`${base}/wp-content/themes/salient/js/build/init.js`]);

      // frontend WPBakery
      await loadSeq([
        `${base}/wp-content/plugins/js_composer_salient/assets/js/dist/js_composer_front.min.js`,
        `${base}/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js`,
      ]);
    })();

    // Limpieza si desmonta
    return () => { cleanCss.forEach((fn) => fn && fn()); };
  }, []);
}




// src/hooks/useWpAssets.js
// import { useEffect } from "react";

// const inject = (tag) => {
//   document.head.appendChild(tag);
//   return () => tag.remove();
// };

// const mkLink = (href) => Object.assign(document.createElement("link"), { rel: "stylesheet", href });
// const mkScript = (src, { defer = true } = {}) =>
//   Object.assign(document.createElement("script"), { src, defer });

// function injectIfExists(href) {
//   const el = mkLink(href);
//   el.onerror = () => el.remove();
//   return inject(el);
// }

// async function loadSeq(urls, { defer = true } = {}) {
//   for (const u of urls) {
//     try {
//       await new Promise((res, rej) => {
//         const s = mkScript(u, { defer });
//         s.onload = () => res();
//         s.onerror = () => { s.remove(); rej(new Error(u)); };
//         document.head.appendChild(s);
//       });
//       return;
//     } catch (e){console.log(e)}
//   }
// }

// export function useWpAssets() {
//   // Clases necesarias del tema
//   useEffect(() => {
//     const cls = ["material", "wpb-js-composer", "vc_responsive"];
//     document.body.classList.add(...cls);
//     return () => document.body.classList.remove(...cls);
//   }, []);

//   // Inyectar assets globales del theme
//   useEffect(() => {
//     const base = import.meta.env.VITE_WP_BASE_URL?.replace(/\/+$/, "");
//     if (!base) return;

//     // ===== CSS base =====
//     const cleanCss = [
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/grid-system.css`)),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/style.css`)),
//       injectIfExists(`${base}/wp-content/themes/salient/css/build/style-non-critical.css`),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/responsive.css`)),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/skin-material.css`)),
//       injectIfExists(`${base}/wp-content/themes/salient/css/build/elements/element-icon-with-text.css`),
//       injectIfExists(`${base}/wp-content/themes/salient/css/build/third-party/cf7.css`),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/plugins/js_composer.css`)),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/font-awesome-legacy.min.css`)),
//       inject(mkLink(`${base}/wp-content/plugins/js_composer_salient/assets/css/js_composer.min.css`)),

//       // Dinámicos globales (menú, estilos globales del theme)
//       injectIfExists(`${base}/wp-content/uploads/salient/menu-dynamic.css`),
//       injectIfExists(`${base}/wp-content/themes/salient/css/salient-dynamic-styles.css`),

//       // Child theme opcional
//       injectIfExists(`${base}/wp-content/themes/salient-child/style.css`),
//     ];

//     // ===== JS =====
//     (async () => {
//       await loadSeq([`${base}/wp-includes/js/jquery/jquery.min.js`], { defer: false });
//       await loadSeq([`${base}/wp-includes/js/jquery/jquery-migrate.min.js`], { defer: false });

//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/imagesLoaded.min.js`]);
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/waypoints.js`]);
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/jquery.easing.min.js`]).catch(() => {});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/transit.min.js`]).catch(() => {});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/superfish.js`]).catch(() => {});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/jquery.fancybox.js`]).catch(() => {});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/anime.min.js`]).catch(() => {});
//       await loadSeq([`${base}/wp-content/plugins/salient-core/js/third-party/touchswipe.min.js`]).catch(() => {});

//       await loadSeq([`${base}/wp-content/themes/salient/js/build/priority.js`]).catch(() => {});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/init.js`]);

//       await loadSeq([
//         `${base}/wp-content/plugins/js_composer_salient/assets/js/dist/js_composer_front.min.js`,
//         `${base}/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js`,
//       ]);
//     })();

//     return () => { cleanCss.forEach((fn) => fn && fn()); };
//   }, []);
// }
