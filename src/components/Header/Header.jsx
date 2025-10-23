import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react"; 
import { HeaderLogo } from "./HeaderLogo";
import { HeaderMenus } from "./HeaderMenus";
import styles from "./styles/Header.module.css";


// query para obtener el logo y los items del topMenu y mainMenu
const GET_HEADER_DATA = gql`
  query {
    salientLogo
    topMenu {
      label
      url
      target
      kind
      objectType
      objectId
    }
    mainMenu {
      label
      url
      target
      kind
      objectType
      objectId
    }

    menuKelowa: menuBySlug(slug: "main-menu-kelowa") {
      label url target kind objectType objectId
    }
    menuVancouver: menuBySlug(slug: "main-menu-vancouver") {
      label url target kind objectType objectId
    }
  }
`;


export function Header() {
  const { data, loading } = useQuery(GET_HEADER_DATA);
  if (loading) return null;
  console.log(data);
  
  
  // Mostramos el Header completo una vez se haya cargado todos los datos traidos por GQL

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <HeaderLogo logo={data.salientLogo} />
        <HeaderMenus topMenu={data.topMenu} mainMenu={data.mainMenu} />
      </div>
    </header>
  );
}


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



// import { gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";
// import { HeaderLogo } from "./HeaderLogo";
// import { HeaderMenus } from "./HeaderMenus";
// import styles from "./styles/Header.module.css";

// /* ---------------------------------------------------------
//  * 1) Hook para obtener país desde backend (API + cookie)
//  * --------------------------------------------------------- */
// // function getCookie(name) {
// //   const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
// //   return match ? decodeURIComponent(match[2]) : null;
// // }

// // function useCountry() {
// //   const [country, setCountry] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     let alive = true;
// //     (async () => {
// //       try {
// //         // 1️⃣ intenta leer cookie primero
// //         const cookieCountry = getCookie("country");
// //         if (cookieCountry) {
// //           setCountry(cookieCountry.toUpperCase());
// //           setLoading(false);
// //           fetch("/api/country").catch(() => {}); // refresca cookie en background
// //           return;
// //         }

// //         // 2️⃣ si no hay cookie, consulta al backend
// //         const r = await fetch("/api/country", { cache: "no-store" });
// //         const j = await r.json();
// //         if (alive) setCountry((j.country || "US").toUpperCase());
// //       } catch {
// //         if (alive) setCountry("US");
// //       } finally {
// //         if (alive) setLoading(false);
// //       }
// //     })();
// //     return () => { alive = false; };
// //   }, []);

// //   return { country, loading };
// // }

// /* ---------------------------------------------------------
//  * 2) Query GraphQL para traer menús desde WordPress
//  * --------------------------------------------------------- */
// const GET_HEADER = gql`
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
//     menuKelowa {
//       label
//       url
//       target
//       kind
//       objectType
//       objectId
//     }
//     menuVancouver {
//       label
//       url
//       target
//       kind
//       objectType
//       objectId
//     }
//   }
// `;

// /* ---------------------------------------------------------
//  * 3) Componente principal del Header
//  * --------------------------------------------------------- */
// export function Header() {
//   // const { country, loading: loadingCountry } = useCountry();
//   const { data } = useQuery(GET_HEADER);


//   // 👇 regla automática:
//   // Si el país es US → muestra menuVancouver
//   // En cualquier otro → muestra menuKelowa
//   // const mainItems = country === "US" ? data.menuVancouver : data.menuKelowa;
//   // console.log(mainItems);

//   return (
//     <header className={styles.header}>
//       <div className={styles.container}>
//         <HeaderLogo logo={data.salientLogo} />
//         <HeaderMenus topMenu={data.topMenu} mainMenu={data.menuVancouver} />
//       </div>
//     </header>
//   );
// }
