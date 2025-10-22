// Home.jsx
import { WpPage } from "./WpPage";

// usa el slug real de tu Home: 'home' o 'inicio'
export function Home() {
  return <WpPage fixedSlug="home" />;
  // URI exacta: <WpPage fixedUri="/home/" />
}
