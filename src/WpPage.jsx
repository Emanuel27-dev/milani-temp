import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";

const NODE_BY_PATH = gql`
query NodeByPath($uri: ID!) {
  contentNode(id: $uri, idType: URI) {
    __typename
    id
    uri
    slug

    ... on Page { title contentRendered wpbCss }
    ... on Post { title contentRendered wpbCss }
    ... on Service { title contentRendered wpbCss }
    # Agrega aquí tus CPT expuestos:
    # ... on Service { title content(format: RENDERED) }
    # ... on Property { title content(format: RENDERED) }
  }

  termNode(id: $uri, idType: URI) {
    __typename
    id
    uri
    slug
    name
    description
  }
}

`;

export function WpPage() {
  const { pathname } = useLocation();
  const uri = pathname.endsWith("/") ? pathname : pathname + "/";
  const { data, loading, error } = useQuery(NODE_BY_PATH, {
    variables: { uri },
    fetchPolicy: "network-only",
  });

  console.log(data);

  if (loading) return null;
  if (error) return <p>Error cargando el contenidooo</p>;


  const node = data?.contentNode;
  if (node) {
    const safe = DOMPurify.sanitize(node.contentRendered || "");
    return (
      <article>
 {/* 1) CSS inline de WPBakery para ESTA página/post */}
        {node.wpbCss && (
          <style
            data-source="wpbakery"
            // es CSS, no lo sanitices con DOMPurify
            dangerouslySetInnerHTML={{ __html: node.wpbCss }}
          />
        )}

        {/* 2) Título si existe */}
        {/* {node.title && <h1 className="tituloPrueba">{node.title}</h1>} */}

        {/* 3) HTML renderizado (shortcodes ya procesados) */}
        <div
          className="contentPrueba"
          dangerouslySetInnerHTML={{ __html: safe }}
        />
      </article>
    );
  }

  const term = data?.termNode;
  if (term) {
    const safe = DOMPurify.sanitize(term.description || "");
    return (
      <section>
        <h1 className="tituloPrueba">{term.name}</h1>
        <div
          className="contentPrueba"
          dangerouslySetInnerHTML={{ __html: safe }}
        />
      </section>
    );
  }

  return <p>Página no encontrada</p>;
}

