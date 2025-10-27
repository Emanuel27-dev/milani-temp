// src/hooks/useWpReflow.js
import { useEffect } from "react";

/**
 * Fuerza la re-inicialización completa de scripts del theme Salient y WPBakery
 * después de que React inyecta contenido dinámico (como contentRendered).
 *
 * Ejecuta comportamientos de:
 * - WPBakery (filas, columnas, sliders)
 * - Salient (nectar.init, sliders, animaciones)
 * - Fancybox, Waypoints, etc.
 */
export function useWpReflow(deps = []) {
  useEffect(() => {
    const runReflow = () => {
      console.log("🔁 [useWpReflow] Reflow de Salient/WPBakery ejecutándose...");

      // Lanzar eventos base de refresco visual
      ["resize", "scroll", "load"].forEach((evt) =>
        window.dispatchEvent(new Event(evt))
      );

      // Asegurarse de que jQuery está disponible
      if (typeof window.jQuery === "undefined") {
        console.warn("⚠️ jQuery no encontrado. Scripts de Salient no se ejecutarán.");
        return;
      }

      const $ = window.jQuery;

      try {
        /* ===============================
         * 1️⃣ WPBakery behaviours
         * =============================== */
        if (window.vc_rowBehaviour) {
          window.vc_rowBehaviour();
          console.log("🧱 vc_rowBehaviour aplicado");
        }

        if (window.vc_waypoints) {
          window.vc_waypoints();
          console.log("📍 vc_waypoints aplicado");
        }

        if (window.vc_plugin_flexslider) {
          window.vc_plugin_flexslider($(".wpb_flexslider"));
          console.log("🖼️ vc_plugin_flexslider aplicado");
        }

        /* ===============================
         * 2️⃣ Salient (Nectar) behaviours
         * =============================== */
        if (window.nectar?.init) {
          try {
            window.nectar.init();
            console.log("🌈 nectar.init() ejecutado");
          } catch (e) {
            console.warn("⚠️ Error al ejecutar nectar.init():", e);
          }
        }

        if (window.nectar?.slider?.reinit) {
          try {
            window.nectar.slider.reinit();
            console.log("🎞️ Nectar Slider reactivado");
          } catch (e) {
            console.warn("⚠️ Error al reactivar Nectar Slider:", e);
          }
        }

        /* ===============================
         * 3️⃣ Fancybox / Lightbox
         * =============================== */
        if ($.fancybox && $("[data-fancybox]").length) {
          try {
            $("[data-fancybox]").fancybox();
            console.log("✨ Fancybox reactivado");
          } catch (e) {
            console.warn("⚠️ Fancybox no pudo reinicializarse:", e);
          }
        }

        /* ===============================
         * 4️⃣ Animaciones por scroll (Waypoints)
         * =============================== */
        if ($.fn.waypoint) {
          $(".wpb_animate_when_almost_visible").waypoint(
            function () {
              $(this.element).addClass("wpb_start_animation");
            },
            { offset: "85%" }
          );
          console.log("💨 Waypoints reactivados");
        }

        /* ===============================
         * 5️⃣ Reforzar CSS dinámico de WPBakery
         * =============================== */
        $(".vc_row, .vc_column_container, .nectar-cta").each(function () {
          const $el = $(this);
          if ($el.css("display") === "block" && $el.hasClass("vc_column-inner")) {
            $el.css("display", "flex");
          }
        });

        /* ===============================
         * 6️⃣ Reforzar eventos visuales finales
         * =============================== */
        ["resize", "scroll"].forEach((evt) =>
          window.dispatchEvent(new Event(evt))
        );
      } catch (err) {
        console.warn("❌ Error durante reflow:", err);
      }
    };

    // ⏳ Pequeño delay para asegurar que React ya pintó todo el HTML
    const timeout = setTimeout(runReflow, 600);

    // 🧹 Limpieza: evitar múltiples reflows sobrepuestos
    return () => clearTimeout(timeout);
  }, deps);
}
