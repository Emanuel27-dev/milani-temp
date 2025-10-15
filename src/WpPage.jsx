import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import { useLocation } from "react-router-dom"
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
`

export function WpPage () {
   const { pathname } = useLocation();
   // Agregando / al final por ejemplo de /offers => /offers/
   const uri = pathname.endsWith("/") ? pathname : pathname + "/";

   const { data, loading, error } = useQuery(NODE_BY_URI, {
      variables: { uri },
   });

   if(loading) return null; // o un skeleton
   if(error) return <p>Error cargando el contenido</p>;

   const dataPage = data?.nodeByUri;
   if(!dataPage) return <p>Pagina no encontrada</p>

   const safe = DOMPurify.sanitize(dataPage.content || "");

   return (
      <article>
         <h1 className="tituloPrueba">{dataPage.title}</h1>
         <div dangerouslySetInnerHTML={{ __html: safe }} className="contentPrueba" />
      </article>
   )
}