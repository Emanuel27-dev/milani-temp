// src/hooks/useWpAssets.jsx
import { useEffect } from "react";

const inject = (tag) => {
  document.head.appendChild(tag);
  return () => tag.remove();
};

const mkLink = (href) => {
  const el = document.createElement("link");
  el.rel = "stylesheet";
  el.href = href;           // ⚠️ sin crossOrigin
  return el;
};

const mkScript = (src, { defer = true } = {}) => {
  const el = document.createElement("script");
  el.src = src;             // ⚠️ sin crossOrigin
  el.defer = defer;
  return el;
};

export function useWpAssets() {
  useEffect(() => {
    const base = import.meta.env.VITE_WP_BASE_URL?.replace(/\/+$/, "");
    if (!base) return;

    const css = [
      mkLink(`${base}/wp-content/plugins/js_composer_salient/assets/css/js_composer.min.css`),
      mkLink(`${base}/wp-content/themes/salient/style.css`),
      mkLink(`${base}/wp-content/themes/salient/css/build/style.css`),
      mkLink(`${base}/wp-content/themes/salient/css/build/grid-system.css`),
    ];

    const jquery   = mkScript(`${base}/wp-includes/js/jquery/jquery.min.js`, { defer: false });
    const waypoints = mkScript(
      `${base}/wp-content/plugins/js_composer_salient/assets/lib/vc/vc_waypoints/vc-waypoints.min.js`
    );
    waypoints.onerror = () => {
      waypoints.removeAttribute("onerror");
      waypoints.src = `${base}/wp-content/plugins/js_composer/assets/lib/waypoints/waypoints.min.js`;
    };

    const vcFront  = mkScript(
      `${base}/wp-content/plugins/js_composer_salient/assets/js/dist/js_composer_front.min.js`
    );

    const cleanups = [
      ...css.map(inject),
      inject(jquery),
      inject(waypoints),
      inject(vcFront),
    ];
    return () => cleanups.forEach((fn) => fn && fn());
  }, []);
}


