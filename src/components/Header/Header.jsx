// import { gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react"; 
// import { HeaderLogo } from "./HeaderLogo";
// import { HeaderMenus } from "./HeaderMenus";
// import styles from "./styles/Header.module.css";


// // query para obtener el logo y los items del topMenu y mainMenu
// const GET_HEADER_DATA = gql`
//   query {
//     salientLogo
//     topMenu {
//       label
//       url
//       target
//       kind
//       objectType
//       objectId
//     }
//     mainMenu {
//       label
//       url
//       target
//       kind
//       objectType
//       objectId
//     }

//     menuKelowa: menuBySlug(slug: "main-menu-kelowa") {
//       label url target kind objectType objectId
//     }
//     menuVancouver: menuBySlug(slug: "main-menu-vancouver") {
//       label url target kind objectType objectId
//     }
//   }
// `;


// export function Header() {
//   const { data, loading } = useQuery(GET_HEADER_DATA);
//   if (loading) return null;
//   console.log(data);
  
  
//   // Mostramos el Header completo una vez se haya cargado todos los datos traidos por GQL

//   return (
//     <header className={styles.header}>
//       <div className={styles.container}>
//         <HeaderLogo logo={data.salientLogo} />
//         <HeaderMenus topMenu={data.topMenu} mainMenu={data.mainMenu} />
//       </div>
//     </header>
//   );
// }


// src/components/Header.jsx
// import { gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";
// import { HeaderLogo } from "./HeaderLogo";
// import { HeaderMenus } from "./HeaderMenus";
// import styles from "./styles/Header.module.css";

// const GET_HEADER = gql`
//   query {
//     salientLogo
//     topMenu { label url target kind objectType objectId }   
//     menuKelowa { label url target kind objectType objectId }    
//     menuVancouver { label url target kind objectType objectId } 
//   }
// `;

// export function Header() {
//   const { data, loading } = useQuery(GET_HEADER, { fetchPolicy: "cache-and-network" });
//   if (loading || !data) return null;

//   // País guardado (ponlo tú desde tu geolocalización). "PE" => Vancouver; default Kelowa.
//   const country = localStorage.getItem("userCountry");
//   const mainItems = country === "PE" ? data.menuVancouver : data.menuKelowa;

//   return (
//     <header className={styles.header}>
//       <div className={styles.container}>
//         <HeaderLogo logo={data.salientLogo} />
//         {/* TopMenu igual, el "main" ahora es Kelowa/Vancouver */}
//         <HeaderMenus topMenu={data.topMenu} mainMenu={mainItems} />
//       </div>
//     </header>
//   );
// }


// src/components/Header.jsx
// import { gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";
// import { HeaderLogo } from "./HeaderLogo";
// import { HeaderMenus } from "./HeaderMenus";
// import styles from "./styles/Header.module.css";
// // import { useCountry } from "../../hooks/useCountry.jsx";

// import { useEffect, useState } from "react";

// function useCountry() {
//   const [country, setCountry] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const url = "https://ipapi.co/json/?__t=" + Date.now(); // <-- evita cache
//         const r = await fetch(url, { cache: "no-store" });
//         const j = await r.json();
//         const code = j.country_code || j.country || "US";
//         console.log("🌎 País detectado:", code, j);
//         if (alive) setCountry(code);
//       } catch (e) {
//         console.error("❌ Error detectando país:", e);
//         if (alive) setCountry("US");
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();
//     return () => { alive = false; };
//   }, []);

//   return { country, loading };
// }


// const GET_HEADER = gql`
//   query {
//     salientLogo
//     topMenu { label url target kind objectType objectId } 
//     menuKelowa { label url target kind objectType objectId }
//     menuVancouver { label url target kind objectType objectId }
//   }
// `;

// export function Header() {
//  const { country, loading: loadingCountry } = useCountry();
//   const { data, loading } = useQuery(GET_HEADER);

//   if (loading || loadingCountry || !data) return null;

//   const mainItems =
//     country === "US" ? data.menuVancouver : data.menuKelowa; // cambio automático
//   return (
//     <header className={styles.header}>
//       <div className={styles.container}>
//         <HeaderLogo logo={data.salientLogo} />
//         <HeaderMenus topMenu={data.topMenu} mainMenu={mainItems} />
//       </div>
//     </header>)
// }



// src/components/Header.jsx
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderMenus } from "./HeaderMenus";
import styles from "./styles/Header.module.css";
import { useEffect, useState } from "react";

/* ---------- Hook robusto para país ---------- */
function useCountry() {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  // 0) Override por query param (QA): ?country=US
  useEffect(() => {
    const qp = new URLSearchParams(window.location.search).get("country");
    if (qp && /^[A-Z]{2}$/.test(qp)) {
      console.log("🌎 País forzado por query param:", qp);
      setCountry(qp);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (country) return; // ya forzado por query param
    let alive = true;

    async function tryFetch(url, picker) {
      const r = await fetch(url + (url.includes("?") ? "&" : "?") + "__t=" + Date.now(), { cache: "no-store" });
      if (!r.ok) throw new Error("bad status " + r.status);
      const j = await r.json();
      const code = picker(j);
      if (!code) throw new Error("no code");
      return code.toUpperCase();
    }

    (async () => {
      try {
        // 1) ipapi
        const c1 = await tryFetch("https://ipapi.co/json/", j => j.country_code || j.country);
        if (alive) { console.log("🌎 ipapi:", c1); setCountry(c1); return; }
      } catch (e){ console.log(e)}

      try {
        // 2) ipwho.is
        const c2 = await tryFetch("https://ipwho.is/", j => j.country_code);
        if (alive) { console.log("🌎 ipwho.is:", c2); setCountry(c2); return; }
      } catch (e){ console.log(e)}


      try {
        // 3) geojs
        const c3 = await tryFetch("https://get.geojs.io/v1/ip/country.json", j => j.country);
        if (alive) { console.log("🌎 geojs:", c3); setCountry(c3); return; }
      } catch (e){ console.log(e)}


      try {
        // 4) ipinfo (limitado gratis)
        const c4 = await tryFetch("https://ipinfo.io/json", j => j.country);
        if (alive) { console.log("🌎 ipinfo:", c4); setCountry(c4); return; }
      } catch (e){ console.log(e)}


      if (alive) {
        console.warn("🌎 fallback: US");
        setCountry("US");
      }
    })().finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [country]);

  return { country, loading };
}

/* ---------- GraphQL ---------- */
const GET_HEADER = gql`
  query {
    salientLogo
    topMenu { label url target kind objectType objectId }
    menuKelowa { label url target kind objectType objectId }
    menuVancouver { label url target kind objectType objectId }
  }
`;

export function Header() {
  const { country, loading: loadingCountry } = useCountry();
  const { data, loading } = useQuery(GET_HEADER);

  if (loading || loadingCountry || !data || !country) return null;

  // Regla: US => Vancouver, el resto => Kelowa
  const mainItems = country === "US" ? data.menuVancouver : data.menuKelowa;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <HeaderLogo logo={data.salientLogo} />
        <HeaderMenus topMenu={data.topMenu} mainMenu={mainItems} />
      </div>
      {/* badge de debug (quítalo cuando termines) */}
      <div style={{position:'fixed',right:8,top:8,fontSize:12,opacity:.6,background:'#000',color:'#fff',padding:'4px 6px',borderRadius:4}}>
        country: {country}
      </div>
    </header>
  );
}
