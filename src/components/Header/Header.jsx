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
