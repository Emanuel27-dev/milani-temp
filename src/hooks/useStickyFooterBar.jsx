import { useEffect, useState } from "react";

export function useStickyFooterBar() {
  const [visible, setVisible] = useState(false);
  const [hiddenInFooter, setHiddenInFooter] = useState(false);

  useEffect(() => {
    const header = document.querySelector(".header");
    const headerBelow = document.querySelector(".header-below");
    const footer = document.querySelector("footer");

    function onScroll() {
      const headerHeight = header.offsetHeight + headerBelow.offsetHeight;

      // 🔥 Cuando la página baja más allá del header completo → mostrar sticky
      if (window.scrollY > headerHeight) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      // 🔥 Si ya entra al área del footer → ocultar sticky
      const footerTop = footer.getBoundingClientRect().top;

      if (footerTop <= window.innerHeight) {
        setHiddenInFooter(true);
      } else {
        setHiddenInFooter(false);
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { visible, hiddenInFooter };
}
