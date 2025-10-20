import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import DOMPurify from "dompurify";

const NODE_BY_URI = gql`
  query NodeByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ... on Page {
        id
        title
        content
        uri
        slug
      }
    }
  }
`;

export function Home() {
  // Definimos directamente la URI de la página "Inicio"
  const { data, loading, error } = useQuery(NODE_BY_URI, {
    variables: { uri: "/inicio/" },
  });

  if (loading) return <p>Cargando contenido...</p>;
  if (error) return <p>Error al cargar la página</p>;

  const page = data?.nodeByUri;
  if (!page) return <p>No se encontró la página de inicio</p>;

  const safeHTML = DOMPurify.sanitize(page.content || "");

  return (
    <section>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
    </section>
  );
}
