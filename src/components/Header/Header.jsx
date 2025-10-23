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
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderMenus } from "./HeaderMenus";
import styles from "./styles/Header.module.css";
// import { useCountry } from "../../hooks/useCountry.jsx";

import { useEffect, useState } from "react";

function useCountry() {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Si estás en producción (Vercel), llama a /api/country
        // Si estás en local, llama directamente a ipapi
        const url =
          import.meta.env.DEV
            ? "https://ipapi.co/json/"
            : "/api/country";

        const r = await fetch(url, { cache: "no-store" });
        const j = await r.json();
        if (alive) setCountry(j.country_code || j.country || "US");
      } catch {
        if (alive) setCountry("US");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { country, loading };
}

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

  if (loading || loadingCountry || !data) return null;

  const mainItems =
    country === "US" ? data.menuVancouver : data.menuKelowa; // cambio automático
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <HeaderLogo logo={data.salientLogo} />
        <HeaderMenus topMenu={data.topMenu} mainMenu={mainItems} />
      </div>
    </header>)
}
