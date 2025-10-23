// import { gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";
// import { useLocation } from "react-router-dom";
// import DOMPurify from "dompurify";

// const NODE_BY_PATH = gql`
// query NodeByPath($uri: ID!) {
//   contentNode(id: $uri, idType: URI) {
//     __typename
//     id
//     uri
//     slug

//     ... on Page { title contentRendered wpbCss }
//     ... on Post { title contentRendered wpbCss }
//     ... on Service { title contentRendered wpbCss }
//     # Agrega aquí tus CPT expuestos:
//     # ... on Service { title content(format: RENDERED) }
//     # ... on Property { title content(format: RENDERED) }
//   }

//   termNode(id: $uri, idType: URI) {
//     __typename
//     id
//     uri
//     slug
//     name
//     description
//   }
// }

// `;

// export function WpPage() {
//   const { pathname } = useLocation();
//   const uri = pathname.endsWith("/") ? pathname : pathname + "/";
//   const { data, loading, error } = useQuery(NODE_BY_PATH, {
//     variables: { uri },
//     fetchPolicy: "network-only",
//   });

//   console.log(data);

//   if (loading) return null;
//   if (error) return <p>Error cargando el contenidooo</p>;

//   const node = data?.contentNode;
//   if (node) {
//     const safe = DOMPurify.sanitize(node.contentRendered || "");
//     return (
//       <article>
//  {/* 1) CSS inline de WPBakery para ESTA página/post */}
//         {node.wpbCss && (
//           <style
//             data-source="wpbakery"
//             // es CSS, no lo sanitices con DOMPurify
//             dangerouslySetInnerHTML={{ __html: node.wpbCss }}
//           />
//         )}

//         {/* 2) Título si existe */}
//         {/* {node.title && <h1 className="tituloPrueba">{node.title}</h1>} */}

//         {/* 3) HTML renderizado (shortcodes ya procesados) */}
//         <div
//           className="contentPrueba"
//           dangerouslySetInnerHTML={{ __html: safe }}
//         />
//       </article>
//     );
//   }

//   const term = data?.termNode;
//   if (term) {
//     const safe = DOMPurify.sanitize(term.description || "");
//     return (
//       <section>
//         <h1 className="tituloPrueba">{term.name}</h1>
//         <div
//           className="contentPrueba"
//           dangerouslySetInnerHTML={{ __html: safe }}
//         />
//       </section>
//     );
//   }

//   return <p>Página no encontrada</p>;
// }

// // WpPage.jsx
// import { gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";
// import { useLocation } from "react-router-dom";
// import DOMPurify from "dompurify";

// const NODE_BY_PATH = gql`
//   query NodeByPath($uri: ID!) {
//     contentNode(id: $uri, idType: URI) {
//       __typename
//       id
//       uri
//       slug
//       ... on Page {
//         title
//         contentRendered
//         wpbCss
//         vcCustomCss
//       }
//       ... on Post {
//         title
//         contentRendered
//         wpbCss
//         vcCustomCss
        
//       }
//       ... on Service {
//         title
//         contentRendered
//         wpbCss
//         vcCustomCss
//       }
//     }
//     termNode(id: $uri, idType: URI) {
//       __typename
//       id
//       uri
//       slug
//       name
//       description
//     }
//   }
// `;

// export function WpPage({ fixedUri, fixedSlug }) {
//   // 1) Normaliza la URI:
//   // - prioridad a fixedUri
//   // - si hay fixedSlug, construye "/slug/"
//   // - si no, usa la ruta del navegador
//   const { pathname } = useLocation();
//   const autoUri = pathname.endsWith("/") ? pathname : pathname + "/";
//   const uri = fixedUri ?? (fixedSlug ? `/${fixedSlug}/` : autoUri);

//   const { data, loading, error } = useQuery(NODE_BY_PATH, {
//     variables: { uri },
//     fetchPolicy: "network-only",
//   });

//   console.log(data);

//   if (loading) return null;
//   if (error) return <p>Error cargando el contenido</p>;

//   const node = data?.contentNode;
//   if (node) {
//     const safe = DOMPurify.sanitize(node.contentRendered || "");
//     return (
//       <article>
//         {node.wpbCss && (
//           <style
//             data-source="wpbakery"
//             dangerouslySetInnerHTML={{ __html: node.wpbCss }}
//           />
//         )}

//         {/* 2) CSS de Page Settings → Custom CSS (vc_custom_css) */}
//         {node.vcCustomCss && (
//           <style
//             data-type="vc_custom-css"
//             dangerouslySetInnerHTML={{ __html: node.vcCustomCss }}
//           />
//         )}

//         {/* <h1 dangerouslySetInnerHTML={{ __html: node.title }} /> */}
//         <div dangerouslySetInnerHTML={{ __html: safe }} />
//       </article>
//     );
//   }

//   const term = data?.termNode;
//   if (term) {
//     const safe = DOMPurify.sanitize(term.description || "");
//     return (
//       <section>
//         <h1 className="tituloPrueba">{term.name}</h1>
//         <div dangerouslySetInnerHTML={{ __html: safe }} />
//       </section>
//     );
//   }

//   return <p>Página no encontrada</p>;
// }



// src/pages/WpPage.jsx
// import { gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";
// import { useLocation } from "react-router-dom";
// import DOMPurify from "dompurify";

// const NODE_BY_PATH = gql`
//   query NodeByPath($uri: ID!) {
//     # ---- Página/Entrada/CPT por URI ----
//     contentNode(id: $uri, idType: URI) {
//       __typename
//       id
//       uri
//       slug

//       ... on Page {
//         title
//         contentRendered
//         wpbCss          # CSS inline generado por WPBakery (Design Options)
//         vcCustomCss     # CSS de Page Settings → Custom CSS
//       }
//       ... on Post {
//         title
//         contentRendered
//         wpbCss
//         vcCustomCss
//       }
//       ... on Service {
//         title
//         contentRendered
//         wpbCss
//         vcCustomCss
//       }
//     }

//     # ---- Terminos (si la URI es de taxonomía) ----
//     termNode(id: $uri, idType: URI) {
//       __typename
//       id
//       uri
//       slug
//       name
//       description
//     }

//     # ---- Extras globales del theme ----
//     salientDynamicCss   # URL a /uploads/salient/menu-dynamic.css si existe
//     salientCustomCss    # CSS global escrito en Options Panel → Custom CSS Code
//   }
// `;

// export function WpPage({ fixedUri, fixedSlug }) {
//   // Normaliza la URI a consultar
//   const { pathname } = useLocation();
//   const autoUri = pathname.endsWith("/") ? pathname : pathname + "/";
//   const uri = fixedUri ?? (fixedSlug ? `/${fixedSlug}/` : autoUri);

//   const { data, loading, error } = useQuery(NODE_BY_PATH, {
//     variables: { uri },
//     fetchPolicy: "network-only",
//   });

//   if (loading) return null;
//   if (error) return <p>Error cargando el contenido</p>;

//   // ---- Inyección de CSS global del theme (si existe) ----
//   // 1) Custom CSS global (Options Panel → Custom CSS Code)
//   if (data?.salientCustomCss) {
//     const id = "salient-custom-css-inline";
//     if (!document.getElementById(id)) {
//       const tag = document.createElement("style");
//       tag.id = id;
//       tag.setAttribute("data-source", "salient-custom-css");
//       tag.textContent = data.salientCustomCss;
//       document.head.appendChild(tag);
//     }
//   }
//   // 2) menu-dynamic.css (si decidieras cargarlo aquí también)
//   if (data?.salientDynamicCss) {
//     const id = "salient-menu-dynamic";
//     if (!document.getElementById(id)) {
//       const link = document.createElement("link");
//       link.id = id;
//       link.rel = "stylesheet";
//       link.href = data.salientDynamicCss;
//       document.head.appendChild(link);
//     }
//   }

//   // ---- Página/Entrada/CPT ----
//   const node = data?.contentNode;
//   if (node) {
//     const safeHtml = DOMPurify.sanitize(node.contentRendered || "");

//     return (
//       <article>
//         {/* 1) CSS inline generado por WPBakery (Design Options) */}
//         {node.wpbCss && (
//           <style
//             data-source="wpbakery-wpbCss"
//             dangerouslySetInnerHTML={{ __html: node.wpbCss }}
//           />
//         )}

//         {/* 2) CSS de Page Settings → Custom CSS */}
//         {node.vcCustomCss && (
//           <style
//             data-type="vc_custom-css"
//             dangerouslySetInnerHTML={{ __html: node.vcCustomCss }}
//           />
//         )}

//         {/* 3) Contenido renderizado */}
//         <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
//       </article>
//     );
//   }

//   // ---- Término de taxonomía ----
//   const term = data?.termNode;
//   if (term) {
//     const safe = DOMPurify.sanitize(term.description || "");
//     return (
//       <section>
//         <h1>{term.name}</h1>
//         <div dangerouslySetInnerHTML={{ __html: safe }} />
//       </section>
//     );
//   }

//   return <p>Página no encontrada</p>;
// }



// src/pages/WpPage.jsx
// import { gql } from "@apollo/client";
// import { useQuery } from "@apollo/client/react";
// import { useLocation } from "react-router-dom";
// import { useEffect } from "react";
// import DOMPurify from "dompurify";

// const NODE_BY_PATH = gql`
//   query NodeByPath($uri: ID!) {
//     contentNode(id: $uri, idType: URI) {
//       __typename
//       id
//       uri
//       slug
//       ... on Page   { title contentRendered wpbCss vcCustomCss }
//       ... on Post   { title contentRendered wpbCss vcCustomCss }
//       ... on Service{ title contentRendered wpbCss vcCustomCss }
//     }
//     termNode(id: $uri, idType: URI) {
//       __typename
//       id
//       uri
//       slug
//       name
//       description
//     }
//     salientDynamicCss   # /uploads/salient/menu-dynamic.css si existe
//     salientCustomCss    # Options Panel → Custom CSS Code
//   }
// `;

// export function WpPage({ fixedUri, fixedSlug }) {
//   const { pathname } = useLocation();
//   const autoUri = pathname.endsWith("/") ? pathname : pathname + "/";
//   const uri = fixedUri ?? (fixedSlug ? `/${fixedSlug}/` : autoUri);

//   const { data, loading, error } = useQuery(NODE_BY_PATH, {
//     variables: { uri },
//     fetchPolicy: "network-only",
//   });

//   // Inyecta CSS global de Salient UNA sola vez por valor
//   useEffect(() => {
//     if (!data) return;

//     // 1) Custom CSS global (inline)
//     const css = data.salientCustomCss;
//     let removeCustomCss;
//     if (css && !document.getElementById("salient-custom-css-inline")) {
//       const tag = document.createElement("style");
//       tag.id = "salient-custom-css-inline";
//       tag.setAttribute("data-source", "salient-custom-css");
//       tag.textContent = css;            // es CSS, no sanitizarlo
//       document.head.appendChild(tag);
//       removeCustomCss = () => tag.remove();
//     }

//     // 2) menu-dynamic.css (hoja enlazada)
//     const href = data.salientDynamicCss;
//     let removeDynamicLink;
//     if (href && !document.getElementById("salient-menu-dynamic")) {
//       const link = document.createElement("link");
//       link.id = "salient-menu-dynamic";
//       link.rel = "stylesheet";
//       link.href = href;
//       document.head.appendChild(link);
//       removeDynamicLink = () => link.remove();
//     }

//     // Limpieza al cambiar de página (opcional)
//     return () => {
//       removeCustomCss?.();
//       removeDynamicLink?.();
//     };
//   }, [data?.salientCustomCss, data?.salientDynamicCss]); // depende SOLO de estos valores

//   if (loading) return null;
//   if (error) return <p>Error cargando el contenido</p>;

//   const node = data?.contentNode;
//   if (node) {
//     const safeHtml = DOMPurify.sanitize(node.contentRendered || "");
//     return (
//       <article>
//         {/* CSS inline de WPBakery (Design Options) */}
//         {node.wpbCss && (
//           <style
//             data-source="wpbakery-wpbCss"
//             dangerouslySetInnerHTML={{ __html: node.wpbCss }}
//           />
//         )}

//         {/* Page Settings → Custom CSS */}
//         {node.vcCustomCss && (
//           <style
//             data-type="vc_custom-css"
//             dangerouslySetInnerHTML={{ __html: node.vcCustomCss }}
//           />
//         )}

//         <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
//       </article>
//     );
//   }

//   const term = data?.termNode;
//   if (term) {
//     const safe = DOMPurify.sanitize(term.description || "");
//     return (
//       <section>
//         <h1>{term.name}</h1>
//         <div dangerouslySetInnerHTML={{ __html: safe }} />
//       </section>
//     );
//   }

//   return <p>Página no encontrada</p>;
// }



// src/pages/WpPage.jsx
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import DOMPurify from "dompurify";

const NODE_BY_PATH = gql`
  query NodeByPath($uri: ID!) {
    contentNode(id: $uri, idType: URI) {
      __typename
      id
      uri
      slug
      ... on Page {
        title
        contentRendered
        wpbCss
        vcCustomCss
        dynamicCss
      }
      ... on Post {
        title
        contentRendered
        wpbCss
        vcCustomCss
        dynamicCss
      }
      ... on Service {
        title
        contentRendered
        wpbCss
        vcCustomCss
        dynamicCss
      }
    }
    termNode(id: $uri, idType: URI) {
      __typename
      id
      uri
      slug
      name
      description
    }
    salientDynamicCss
    salientCustomCss
  }
`;

export function WpPage({ fixedUri, fixedSlug }) {
  const { pathname } = useLocation();
  const autoUri = pathname.endsWith("/") ? pathname : pathname + "/";
  const uri = fixedUri ?? (fixedSlug ? `/${fixedSlug}/` : autoUri);

  const { data, loading, error } = useQuery(NODE_BY_PATH, {
    variables: { uri },
    fetchPolicy: "network-only",
  });

  /* -----------------------------------------------------
   * 1️⃣ Inyectar CSS global de Salient (solo una vez)
   * ----------------------------------------------------- */
  useEffect(() => {
    if (!data) return;

    // Custom CSS global
    const css = data.salientCustomCss;
    if (css && !document.getElementById("salient-custom-css-inline")) {
      const tag = document.createElement("style");
      tag.id = "salient-custom-css-inline";
      tag.textContent = css;
      document.head.appendChild(tag);
    }

    // menu-dynamic.css
    const href = data.salientDynamicCss;
    if (href && !document.getElementById("salient-menu-dynamic")) {
      const link = document.createElement("link");
      link.id = "salient-menu-dynamic";
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, [data?.salientCustomCss, data?.salientDynamicCss]);

  /* -----------------------------------------------------
   * 2️⃣ Inyectar CSS dinámico específico de la página
   * ----------------------------------------------------- */
  useEffect(() => {
    if (!data?.contentNode) return;
    const node = data.contentNode;

    // Helper para inyectar un <style> en <head>
    const injectStyle = (id, css) => {
      if (!css) return;
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement("style");
        tag.id = id;
        document.head.appendChild(tag);
      }
      tag.textContent = css;
    };

    injectStyle("wpbCss", node.wpbCss);
    injectStyle("vcCustomCss", node.vcCustomCss);
    injectStyle("wp-dynamic-css", node.dynamicCss);

    return () => {
      document.getElementById("wpbCss")?.remove();
      document.getElementById("vcCustomCss")?.remove();
      document.getElementById("wp-dynamic-css")?.remove();
    };
  }, [data?.contentNode?.id]);

  /* -----------------------------------------------------
   * 3️⃣ Render del contenido (HTML)
   * ----------------------------------------------------- */
  if (loading) return null;
  if (error) return <p>Error cargando el contenido</p>;

  const node = data?.contentNode;
  if (node) {
    const safeHtml = DOMPurify.sanitize(node.contentRendered || "");
    return (
      <article>
        <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
      </article>
    );
  }

  const term = data?.termNode;
  if (term) {
    const safe = DOMPurify.sanitize(term.description || "");
    return (
      <section>
        <h1>{term.name}</h1>
        <div dangerouslySetInnerHTML={{ __html: safe }} />
      </section>
    );
  }

  return <p>Página no encontrada</p>;
}
