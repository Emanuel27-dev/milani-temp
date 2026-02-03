// src/hooks/useWpReflow.jsx
import { useEffect } from "react";

export function useWpReflow(deps = []) {
  useEffect(() => {
    let raf1, raf2, timeout;

    const safe = (fn, label = "") => {
      try {
        fn && fn();
      } catch (e) {
        console.warn(`⚠️ Reflow error ignorado ${label}`, e);
      }
    };

    const runReflow = () => {
      if (!window.jQuery) {
        console.warn("❌ jQuery no disponible aún");
        return;
      }

      const $ = window.jQuery;

      console.group("🔁 [useWpReflow] Salient SPA Reflow");

      /* ---------------------------------
       * 1️⃣ Eventos base
       * --------------------------------- */
      console.log("📐 Dispatch resize / scroll");
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));

      /* ---------------------------------
       * 2️⃣ WPBakery core
       * --------------------------------- */
      console.log("🧱 WPBakery re-init");
      safe(() => window.vc_rowBehaviour && window.vc_rowBehaviour(), "vc_rowBehaviour");
      safe(() => window.vc_waypoints && window.vc_waypoints(), "vc_waypoints");

      /* ---------------------------------
       * 3️⃣ Flickity activos (resize)
       * --------------------------------- */
      if (window.Flickity) {
        console.log("🎠 Flickity detectado (resize)");
        $(".flickity-enabled").each(function () {
          if (this.flickity) {
            safe(() => this.flickity.resize(), "flickity.resize");
            safe(() => this.flickity.reposition(), "flickity.reposition");
          }
        });
      }

      /* -------------------------------------------------
       * 3️⃣b Nectar Flickity / Flickity SPA-safe
       * FIX DEFINITIVO (zombie sliders + SPA)
       * ------------------------------------------------- */
      const sliders = $(".nectar-flickity");
      console.log(`🎯 Sliders detectados: ${sliders.length}`);

      sliders.each(function () {
        const el = this;
        const $el = $(el);

        const hasViewport = $el.find(".flickity-viewport").length > 0;
        const flkty = el.flickity || $el.data("flickity");

        try {
          /* ---------------------------------
           * 🟢 Caso 1: Slider vivo → REBIND
           * --------------------------------- */
          if (flkty) {
            console.log("🔄 Slider existente → rebind Flickity");

            safe(() => flkty.resize(), "flkty.resize");
            safe(() => flkty.reposition(), "flkty.reposition");
            safe(() => flkty.select(0, false, true), "flkty.select");

            if (flkty.options?.autoPlay) {
              safe(() => flkty.playPlayer(), "flkty.autoplay");
            }

            console.log("✅ Slider reactivado correctamente (SPA)");
            return;
          }

          /* ---------------------------------
           * 🧟 Caso 2: DOM mutado pero sin instancia
           * (EL BUG REAL DE SALIENT EN SPA)
           * --------------------------------- */
          if (hasViewport && $.fn?.nectarFlickity) {
            console.warn("🧟 Slider zombie detectado → reset + nectarFlickity");

            // 🧼 Reset controlado (sin tocar contenido)
            $el
              .removeClass("flickity-enabled is-draggable")
              .addClass("not-initialized");

            $el.find(".flickity-page-dots").remove();
            $el.find(".flickity-viewport").children().unwrap();
            $el.find(".flickity-slider").children().unwrap();

            // 🔥 Init real Salient
            $el.nectarFlickity();

            console.log("✅ Slider regenerado correctamente (SPA)");
            return;
          }

          /* ---------------------------------
           * 🟡 Caso 3: DOM limpio + nectarFlickity
           * --------------------------------- */
          if (!hasViewport && $.fn?.nectarFlickity) {
            console.log("🚀 Init nectarFlickity (DOM limpio)");
            $el.addClass("not-initialized");
            $el.nectarFlickity();
            return;
          }

          /* ---------------------------------
           * 🔥 Caso 4: Fallback Flickity NATIVO
           * (solo si DOM limpio)
           * --------------------------------- */
          if (window.Flickity && !hasViewport) {
            console.warn("⚠️ Fallback → Flickity nativo");

            const options = {
              wrapAround: el.dataset.wrap === "wrap",
              cellAlign: el.dataset.centeredCells === "true" ? "center" : "left",
              pageDots: true,
              prevNextButtons: true,
              autoPlay: el.dataset.autoplay
                ? parseInt(el.dataset.autoplayDur || 5000, 10)
                : false,
              adaptiveHeight: el.dataset.adaptiveHeight === "true",
            };

            new window.Flickity(el, options);
            console.log("✅ Flickity nativo inicializado");
            return;
          }

          console.log("ℹ️ Slider ignorado (estado no compatible)");
        } catch (e) {
          console.error("❌ Error procesando slider", e);
        }
      });

      /* ---------------------------------
       * 4️⃣ Flexslider
       * --------------------------------- */
      if ($.fn.flexslider) {
        console.log("📽 Flexslider detectado");
        $(".flexslider").each(function () {
          safe(() => $(this).flexslider(0), "flexslider");
        });
      }

      /* ---------------------------------
       * 5️⃣ Animaciones WPBakery
       * --------------------------------- */
      if ($.fn.waypoint) {
        console.log("🎬 Rebind animaciones");
        $(".wpb_animate_when_almost_visible").each(function () {
          if (!this || !this.classList) return;
          if (this.dataset.wpbAnimated) return;

          this.dataset.wpbAnimated = "true";

          safe(
            () =>
              $(this).waypoint(
                () => this.classList.add("wpb_start_animation"),
                { offset: "85%" }
              ),
            "wpb animation"
          );
        });
      }

      /* ---------------------------------
       * 6️⃣ Fancybox
       * --------------------------------- */
      if ($.fancybox) {
        console.log("🖼 Fancybox rebind");
        $("[data-fancybox]").each(function () {
          if (this.dataset.fancyboxInit) return;
          this.dataset.fancyboxInit = "true";
          safe(() => $(this).fancybox(), "fancybox");
        });
      }

      /* ---------------------------------
       * 7️⃣ Eventos finales
       * --------------------------------- */
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));

      console.groupEnd();
    };

    // ⏳ Esperar DOM + CSS + HTML REAL
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        timeout = setTimeout(runReflow, 300);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timeout);
    };
  }, deps);
}
