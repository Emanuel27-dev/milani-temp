import styles from "./styles/HeaderLogo.module.css";

// componente para el logo (solo imagen)
export function HeaderLogo ({ logo }) {
   return (
      <figure className={styles.figure}>
         <img src={logo} alt="Milani logo" className={styles.img} />
      </figure>
   )
}