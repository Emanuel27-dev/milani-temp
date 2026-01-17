import { useEffect } from "react";

export function useWpReflow(deps = []) {
  useEffect(() => {
    let raf1, raf2, timeout;

    const safe = (fn) => {
      try {
        fn && fn();
      } catch (_) {}
    };

    const runReflow = () => {
      if (!window.jQuery) return;

      const $ = window.jQuery;

      console.log("🔁 [useWpReflow] Reflow seguro SPA");

      // -------------------------------------------------
      // 1️⃣ Eventos base (seguros)
      // -------------------------------------------------
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));

      // -------------------------------------------------
      // 2️⃣ WPBakery (solo lo estable)
      // -------------------------------------------------
      safe(() => window.vc_rowBehaviour && window.vc_rowBehaviour());
      safe(() => window.vc_waypoints && window.vc_waypoints());

      // -------------------------------------------------
      // 3️⃣ Sliders (Flickity / Flexslider)
      // -------------------------------------------------
      if (window.Flickity) {
        $(".flickity-enabled").each(function () {
          safe(() => this.flickity && this.flickity.resize());
        });
      }

      // -------------------------------------------------
      // 4️⃣ Fancybox (solo si NO está inicializado)
      // -------------------------------------------------
      if ($.fancybox) {
        $("[data-fancybox]").each(function () {
          if (this.dataset.fancyboxInit) return;
          this.dataset.fancyboxInit = "true";
          safe(() => $(this).fancybox());
        });
      }

      // -------------------------------------------------
      // 5️⃣ Animaciones WPBakery (defensivo)
      // -------------------------------------------------
      if ($.fn.waypoint) {
        $(".wpb_animate_when_almost_visible").each(function () {
          if (!this || !this.classList) return;
          if (this.dataset.wpbAnimated) return;

          this.dataset.wpbAnimated = "true";

          safe(() =>
            $(this).waypoint(
              () => this.classList.add("wpb_start_animation"),
              { offset: "85%" }
            )
          );
        });
      }

      // -------------------------------------------------
      // 6️⃣ Eventos finales
      // -------------------------------------------------
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
    };

    // Esperar DOM + React + assets
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        timeout = setTimeout(runReflow, 200);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timeout);
    };
  }, deps);
}
