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


//src/components/Header.jsx
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderMenus } from "./HeaderMenus";
import styles from "./styles/Header.module.css";
import { useIPLocation } from "../../hooks/useIPLocation";


const GET_HEADER = gql`
  query {
    salientLogo
    topMenu { label url target kind objectType objectId } 
    menuKelowa { label url target kind objectType objectId }
    menuVancouver { label url target kind objectType objectId }
  }
`;

export function Header() {
  const { location } = useIPLocation();
  const { data, loading } = useQuery(GET_HEADER);

  if (loading || !data) return null;
// United States
  const mainItems =
    location?.pais === "United States" ? data.menuVancouver : data.menuKelowa; // cambio automático
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <HeaderLogo logo={data.salientLogo} />
        <HeaderMenus topMenu={data.topMenu} mainMenu={mainItems} />
      </div>
    </header>)
}



