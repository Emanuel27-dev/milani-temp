// import { useEffect } from "react";

// const inject = (tag) => {
//   document.head.appendChild(tag);
//   return () => tag.remove();
// };

// const mkLink = (href) => {
//   const el = document.createElement("link");
//   el.rel = "stylesheet";
//   el.href = href;           // ⚠️ sin crossOrigin
//   return el;
// };

// const mkScript = (src, { defer = true } = {}) => {
//   const el = document.createElement("script");
//   el.src = src;             // ⚠️ sin crossOrigin
//   el.defer = defer;
//   return el;
// };

// export function useWpAssets() {
//   useEffect(() => {
//     const base = import.meta.env.VITE_WP_BASE_URL?.replace(/\/+$/, "");
//     if (!base) return;

//     const css = [
//       mkLink(`${base}/wp-content/plugins/js_composer_salient/assets/css/js_composer.min.css`),
//       mkLink(`${base}/wp-content/themes/salient/style.css`),
//       mkLink(`${base}/wp-content/themes/salient/css/build/style.css`),
//       mkLink(`${base}/wp-content/themes/salient/css/build/grid-system.css`),
//     ];

//     const jquery   = mkScript(`${base}/wp-includes/js/jquery/jquery.min.js`, { defer: false });
//     const waypoints = mkScript(
//       `${base}/wp-content/plugins/js_composer_salient/assets/lib/vc/vc_waypoints/vc-waypoints.min.js`
//     );
//     waypoints.onerror = () => {
//       waypoints.removeAttribute("onerror");
//       waypoints.src = `${base}/wp-content/plugins/js_composer/assets/lib/waypoints/waypoints.min.js`;
//     };

//     const vcFront  = mkScript(
//       `${base}/wp-content/plugins/js_composer_salient/assets/js/dist/js_composer_front.min.js`
//     );

//     const cleanups = [
//       ...css.map(inject),
//       inject(jquery),
//       inject(waypoints),
//       inject(vcFront),
//     ];
//     return () => cleanups.forEach((fn) => fn && fn());
//   }, []);
// }


// src/hooks/useWpAssets.jsx
// import { useEffect } from "react";

// function inject(tag) {
//   document.head.appendChild(tag);
//   return () => tag.remove();
// }
// const mkLink   = (href) => Object.assign(document.createElement("link"), { rel: "stylesheet", href });
// const mkScript = (src, { defer = true } = {}) =>
//   Object.assign(document.createElement("script"), { src, defer });

// async function loadSeq(urls, { defer = true } = {}) {
//   for (const u of urls) {
//     try {
//       await new Promise((res, rej) => {
//         const s = mkScript(u, { defer });
//         s.onload = () => { res(inject(s)); };
//         s.onerror = () => { s.remove(); rej(new Error(u)); };
//         document.head.appendChild(s);
//       });
//       return; // cargó el primero que existía
//     } catch { /* intenta siguiente */ }
//   }
// }

// export function useWpAssets() {
//   useEffect(() => {
//     const base = import.meta.env.VITE_WP_BASE_URL?.replace(/\/+$/, "");
//     if (!base) return;

//     // ---------- CSS ----------
//     const css = [
//       `${base}/wp-content/themes/salient/css/build/grid-system.css`,
//       `${base}/wp-content/themes/salient/css/build/style.css`,
//       `${base}/wp-content/themes/salient/css/build/responsive.css`,
//       `${base}/wp-content/themes/salient/css/build/skin-material.css`,
//       `${base}/wp-content/themes/salient/css/build/plugins/js_composer.css`,
//       `${base}/wp-content/themes/salient/css/font-awesome-legacy.min.css`,
//       `${base}/wp-content/plugins/js_composer_salient/assets/css/js_composer.min.css`,

      
//       // Opcionales:
//       `${base}/wp-content/themes/salient/style.css`,
//       `${base}/wp-content/themes/salient-child/style.css`,
//       `${base}/wp-content/uploads/salient/menu-dynamic.css`,
//     ];
//     const cssCleanups = css.map(href => inject(mkLink(href)));

//     // ---------- Google Fonts (AQUÍ) ----------
//     // Si no quieres preconnect, comenta las dos primeras líneas y deja solo gCss.
//     const gPre1 = Object.assign(document.createElement("link"), {
//       rel: "preconnect",
//       href: "https://fonts.googleapis.com",
//     });
//     const gPre2 = Object.assign(document.createElement("link"), {
//       rel: "preconnect",
//       href: "https://fonts.gstatic.com",
//       crossOrigin: "anonymous",   // seguro; si prefieres, usa crossOrigin:""
//     });
//     const gCss  = mkLink(
//       "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap"
//     );
//     const gfCleanups = [gPre1, gPre2, gCss].map(inject);

//     // ---------- JS (orden estricto) ----------
//     (async () => {
//       await loadSeq([`${base}/wp-includes/js/jquery/jquery.min.js`], { defer: false });
//       await loadSeq([`${base}/wp-includes/js/jquery/jquery-migrate.min.js`], { defer: false });

//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/imagesLoaded.min.js`]);
//       await loadSeq([
//         `${base}/wp-content/themes/salient/js/build/third-party/waypoints.js`,
//         `${base}/wp-content/plugins/js_composer/assets/lib/waypoints/waypoints.min.js`,
//       ]);

//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/jquery.easing.min.js`]).catch(()=>{});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/transit.min.js`]).catch(()=>{});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/superfish.js`]).catch(()=>{});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/jquery.fancybox.js`]).catch(()=>{});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/anime.min.js`]).catch(()=>{});

//       await loadSeq([`${base}/wp-content/themes/salient/js/build/init.js`]);

//       await loadSeq([
//         `${base}/wp-content/plugins/js_composer_salient/assets/js/dist/js_composer_front.min.js`,
//         `${base}/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js`,
//       ]);
//     })();

//     return () => {
//       cssCleanups.forEach(fn => fn && fn());
//       gfCleanups.forEach(fn => fn && fn());  // limpia Google Fonts también
//     };
//   }, []);
// }



// import { useEffect } from "react";

// const inject = (tag) => { document.head.appendChild(tag); return () => tag.remove(); };
// const mkLink = (href) => Object.assign(document.createElement("link"), { rel: "stylesheet", href });
// const mkScript = (src, { defer = true } = {}) =>
//   Object.assign(document.createElement("script"), { src, defer });

// /** Inyecta un <link> y lo borra si la URL no existe (onerror). */
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
//         s.onload = () => { res(inject(s)); };
//         s.onerror = () => { s.remove(); rej(new Error(u)); };
//         document.head.appendChild(s);
//       });
//       return; // cargó el primero disponible
//     } catch { /* intenta siguiente */ }
//   }
// }

// export function useWpAssets() {
//   // 1) Clases que el tema espera en <body>
//   useEffect(() => {
//     const cls = ["wp-theme-salient", "material", "wpb-js-composer", "vc_responsive"];
//     document.body.classList.add(...cls);
//     return () => document.body.classList.remove(...cls);
//   }, []);

//   // 2) CSS/JS globales
//   useEffect(() => {
//     const base = import.meta.env.VITE_WP_BASE_URL?.replace(/\/+$/, "");
//     if (!base) return;

//     // ---------- CSS del tema + WPBakery ----------
//     const cssClean = [
//       // Salient core
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/grid-system.css`)),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/style.css`)),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/responsive.css`)),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/skin-material.css`)),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/plugins/js_composer.css`)),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/font-awesome-legacy.min.css`)),

//       // WPBakery (bundle del plugin Salient)
//       inject(mkLink(`${base}/wp-content/plugins/js_composer_salient/assets/css/js_composer.min.css`)),

//       // Opcionales
//       injectIfExists(`${base}/wp-content/themes/salient/style.css`),
//       injectIfExists(`${base}/wp-content/themes/salient-child/style.css`),

//       // 🌟 CSS dinámico del tema (menú/header generado por Salient)
//       injectIfExists(`${base}/wp-content/uploads/salient/menu-dynamic.css`),
//       injectIfExists(`${base}/wp-content/themes/salient/css/salient-dynamic-styles.css`),

//       // 🌟 CSS adicional del menú off-canvas
//       injectIfExists(`${base}/wp-content/themes/salient/css/build/off-canvas/core.css`),
//       injectIfExists(`${base}/wp-content/themes/salient/css/build/off-canvas/slide-out-right-material.css`),
//       injectIfExists(`${base}/wp-content/themes/salient/css/build/off-canvas/slide-out-right-hover.css`),

//       // 🌟 CSS no crítico (opcional)
//       injectIfExists(`${base}/wp-content/themes/salient/css/build/style-non-critical.css`),
//     ];

//     // ---------- Google Fonts (opcional) ----------
//     const gPre1 = Object.assign(document.createElement("link"), {
//       rel: "preconnect", href: "https://fonts.googleapis.com",
//     });
//     const gPre2 = Object.assign(document.createElement("link"), {
//       rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous",
//     });
//     const gCss = mkLink("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap");
//     const gfClean = [gPre1, gPre2, gCss].map(inject);

//     // ---------- JS (orden estricto) ----------
//     (async () => {
//       // jQuery + migrate (sin defer)
//       await loadSeq([`${base}/wp-includes/js/jquery/jquery.min.js`], { defer: false });
//       await loadSeq([`${base}/wp-includes/js/jquery/jquery-migrate.min.js`], { defer: false });

//       // Dependencias usadas por Salient/WPBakery
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/imagesLoaded.min.js`]);
//       await loadSeq([
//         `${base}/wp-content/themes/salient/js/build/third-party/waypoints.js`,
//         `${base}/wp-content/plugins/js_composer/assets/lib/waypoints/waypoints.min.js`, // fallback
//       ]);

//       // Utilidades (opcionales)
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/jquery.easing.min.js`]).catch(() => {});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/transit.min.js`]).catch(() => {});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/superfish.js`]).catch(() => {});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/jquery.fancybox.js`]).catch(() => {});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/anime.min.js`]).catch(() => {});

//       // 🌟 Scripts adicionales del tema
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/priority.js`]).catch(() => {});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/hoverintent.min.js`]).catch(() => {});
//       await loadSeq([`${base}/wp-content/plugins/salient-core/js/third-party/touchswipe.min.js`]).catch(() => {});

//       // Init del tema
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/init.js`]);

//       // Frontend de WPBakery
//       await loadSeq([
//         `${base}/wp-content/plugins/js_composer_salient/assets/js/dist/js_composer_front.min.js`,
//         `${base}/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js`,
//       ]);
//     })();

//     return () => {
//       cssClean.forEach((fn) => fn && fn());
//       gfClean.forEach((fn) => fn && fn());
//     };
//   }, []);
// }


// import { useEffect } from "react";

// const inject = (tag) => { document.head.appendChild(tag); return () => tag.remove(); };
// const mkLink = (href) => Object.assign(document.createElement("link"), { rel: "stylesheet", href });
// const mkScript = (src, { defer = true } = {}) =>
//   Object.assign(document.createElement("script"), { src, defer });

// /** Inyecta un <link> y lo borra si la URL no existe (onerror). */
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
//         s.onload = () => { res(inject(s)); };
//         s.onerror = () => { s.remove(); rej(new Error(u)); };
//         document.head.appendChild(s);
//       });
//       return; // cargó el primero disponible
//     } catch { /* intenta siguiente */ }
//   }
// }

// export function useWpAssets() {

//   // 1️⃣ Clases que el tema espera en <body>
//   useEffect(() => {
//     const cls = ["wp-theme-salient", "material", "wpb-js-composer", "vc_responsive"];
//     document.body.classList.add(...cls);
//     return () => document.body.classList.remove(...cls);
//   }, []);

//   // 2️⃣ Carga dinámica de CSS + JS globales
//   useEffect(() => {
//     const base = import.meta.env.VITE_WP_BASE_URL?.replace(/\/+$/, "");
//     if (!base) return;

//     // ---------- CSS del tema + WPBakery ----------
//     const cssClean = [
//       // 🧱 Salient core (orden correcto)
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/grid-system.css`)),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/style.css`)),
//       injectIfExists(`${base}/wp-content/themes/salient/css/build/style-non-critical.css`), // <- importante
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/responsive.css`)),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/skin-material.css`)),

//       // <- animaciones nectar nectar-single-styles.min
//       // injectIfExists(`${base}/wp-content/themes/salient/css/build/nectar-frontend.css`),
//       injectIfExists(`${base}/wp-content/themes/salient/css/build/nectar-single-styles.min.css`),
      
    

//       // 🎨 Plugins CSS del theme
//       inject(mkLink(`${base}/wp-content/themes/salient/css/build/plugins/js_composer.css`)),
//       inject(mkLink(`${base}/wp-content/themes/salient/css/font-awesome-legacy.min.css`)),

//       // 🧩 WPBakery (bundle del plugin Salient)
//       inject(mkLink(`${base}/wp-content/plugins/js_composer_salient/assets/css/js_composer.min.css`)),

//       // 🌈 Opcionales / dinámicos
//       injectIfExists(`${base}/wp-content/themes/salient/style.css`),
//       injectIfExists(`${base}/wp-content/themes/salient-child/style.css`),
//       injectIfExists(`${base}/wp-content/uploads/salient/menu-dynamic.css`),     // CSS generado dinámicamente
//       injectIfExists(`${base}/wp-content/themes/salient/css/salient-dynamic-styles.css`),

//       // 🧭 Off-canvas menu (según configuración)
//       injectIfExists(`${base}/wp-content/themes/salient/css/build/off-canvas/core.css`),
//       injectIfExists(`${base}/wp-content/themes/salient/css/build/off-canvas/slide-out-right-material.css`),
//       injectIfExists(`${base}/wp-content/themes/salient/css/build/off-canvas/slide-out-right-hover.css`),
//     ];

//     // ---------- Google Fonts ----------
//     const gPre1 = Object.assign(document.createElement("link"), {
//       rel: "preconnect", href: "https://fonts.googleapis.com",
//     });
//     const gPre2 = Object.assign(document.createElement("link"), {
//       rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous",
//     });
//     const gCss = mkLink("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap");
//     const gfClean = [gPre1, gPre2, gCss].map(inject);

//     // ---------- JS (orden estricto) ----------
//     (async () => {
//       // jQuery + migrate (sin defer)
//       await loadSeq([`${base}/wp-includes/js/jquery/jquery.min.js`], { defer: false });
//       await loadSeq([`${base}/wp-includes/js/jquery/jquery-migrate.min.js`], { defer: false });

//       // Dependencias de Salient/WPBakery
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/imagesLoaded.min.js`]);
//       await loadSeq([
//         `${base}/wp-content/themes/salient/js/build/third-party/waypoints.js`,
//         `${base}/wp-content/plugins/js_composer/assets/lib/waypoints/waypoints.min.js`, // fallback
//       ]);

//       // Utilidades (opcionales)
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/jquery.easing.min.js`]).catch(()=>{});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/transit.min.js`]).catch(()=>{});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/superfish.js`]).catch(()=>{});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/jquery.fancybox.js`]).catch(()=>{});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/anime.min.js`]).catch(()=>{});

//       // 🌟 Scripts adicionales del tema
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/priority.js`]).catch(()=>{});
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/third-party/hoverintent.min.js`]).catch(()=>{});
//       await loadSeq([`${base}/wp-content/plugins/salient-core/js/third-party/touchswipe.min.js`]).catch(()=>{});

//       // ⚙️ Init del tema
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/init.js`]);

//       // 🌈 Animaciones Nectar (activa efectos visuales)
//       await loadSeq([`${base}/wp-content/themes/salient/js/build/nectar-frontend.js`]).catch(()=>{});

//       // 🧩 Frontend de WPBakery
//       await loadSeq([
//         `${base}/wp-content/plugins/js_composer_salient/assets/js/dist/js_composer_front.min.js`,
//         `${base}/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js`,
//       ]);
//     })();

//     // Limpieza al desmontar
//     return () => {
//       cssClean.forEach(fn => fn && fn());
//       gfClean.forEach(fn => fn && fn());
//     };
//   }, []);
// }

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
      injectIfExists(`${base}/wp-content/themes/salient/css/salient-dynamic-styles.css`),

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
