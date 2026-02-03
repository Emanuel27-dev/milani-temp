// src/WpPage.jsx
import { Helmet } from "react-helmet-async";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useLocation, useOutletContext } from "react-router-dom";
import DOMPurify from "dompurify";
import { useEffect, useMemo } from "react";

// 🔹 Hooks personalizados
import { useWpGlobalAssets } from "./hooks/useWpGlobalAssets";
import { useWpBodyAttributesFromWp } from "./hooks/useWpBodyAttributesFromWp";
import { usePageCss } from "./hooks/usePageCss";
import { useWpReflow } from "./hooks/useWpReflow";
import useIframeReflow from "./hooks/useIframeReflow";

// =========================================================
// 🔹 QUERY PRINCIPAL
// =========================================================
const NODE_BY_PATH = gql`
  query NodeByPath($uri: ID!) {
    contentNode(id: $uri, idType: URI) {
      __typename
      id
      databaseId
      uri
      slug

      ... on Page {
        title
        contentRendered
        wpbCss
        vcCustomCss
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
          schema {
            raw
          }
        }
        inlineDynamicCssGrouped {
          emoji
          global
          main
          dynamic
        }
      }

      ... on Post {
        title
        contentRendered
        wpbCss
        vcCustomCss
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
          schema {
            raw
          }
        }
        inlineDynamicCssGrouped {
          emoji
          global
          main
          dynamic
        }
      }

      ... on Career {
        title
        contentRendered
        wpbCss
        vcCustomCss
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
          schema {
            raw
          }
        }
        inlineDynamicCssGrouped {
          emoji
          global
          main
          dynamic
        }
      }

      ... on Service {
        title
        contentRendered
        wpbCss
        vcCustomCss
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
          twitterTitle
          twitterDescription
          twitterImage {
            sourceUrl
          }
          schema {
            raw
          }
        }
        inlineDynamicCssGrouped {
          emoji
          global
          main
          dynamic
        }
      }
    }

    bodyAttributes
  }
`;

export function WpPage({ fixedUri, fixedSlug }) {
  const location = useLocation();
  const { pathname } = location;

  const { homeData } = useOutletContext() || {};
  const REGIONS = ["okanagan", "calgary", "lowermainland", "edmonton", "vancouverisland"];

  // =========================================================
  // 🔹 LIMPIAR PATH (quitar región y /service)
  // =========================================================
  const cleanPathname = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);

    if (REGIONS.includes(parts[0])) parts.shift();
    if (parts[0] === "service") parts.shift();

    if (parts.length === 0) return "/home/";
    return "/" + parts.join("/") + "/";
  }, [pathname]);

  // =========================================================
  // 🔹 URIs CANDIDATAS (PAGE/POST → SERVICE)
  // =========================================================
  const uriCandidates = useMemo(() => {
    if (fixedUri) return [fixedUri];
    if (fixedSlug) return [`/${fixedSlug}/`];

    if (cleanPathname === "/home/") {
      return ["/home/"];
    }

    // 🔑 orden importa
    return [
      cleanPathname,               // Page o Post
      `/service${cleanPathname}`,  // Service (fallback)
    ];
  }, [fixedUri, fixedSlug, cleanPathname]);

  // =========================================================
  // 🔹 QUERY 1: PAGE / POST
  // =========================================================
  const {
    data: primaryData,
    loading: loadingPrimary,
  } = useQuery(NODE_BY_PATH, {
    variables: { uri: uriCandidates[0] },
    fetchPolicy: "cache-and-network",
  });

  const primaryNode = primaryData?.contentNode;

  // =========================================================
  // 🔹 QUERY 2: SERVICE (SOLO SI NO EXISTE EL PRIMERO)
  // =========================================================
  const shouldTryService =
    !loadingPrimary &&
    !primaryNode &&
    uriCandidates.length > 1;

  const {
    data: serviceData,
    loading: loadingService,
  } = useQuery(NODE_BY_PATH, {
    variables: { uri: uriCandidates[1] },
    skip: !shouldTryService,
    fetchPolicy: "cache-and-network",
  });

  const node = primaryNode || serviceData?.contentNode;
  const loading = loadingPrimary || loadingService;

  // =========================================================
  // 🔹 HOME DETECTION
  // =========================================================
  const isHome =
    pathname === "/okanagan" ||
    pathname === "/calgary" ||
    pathname === "/edmonton" ||
    pathname === "/lowermainland" ||
    pathname === "/vancouverisland" ||
    pathname === "/home" ||
    pathname === "/home/";

  // =========================================================
  // 🔹 SIDE EFFECTS
  // =========================================================
  useEffect(() => {
    if (isHome) {
      document.title = "Milani Plumbing Heating & Air Conditioning";
    } else if (node?.title) {
      document.title = `${node.title} – Milani Plumbing Heating & Air Conditioning`;
    }
  }, [node?.title, isHome]);

  // hooks
  useWpGlobalAssets();
  useWpBodyAttributesFromWp({ data: primaryData || serviceData });
  usePageCss(node);

  // 🔑 CLAVE DEL REFLOW
  const reflowKey = node?.uri || cleanPathname;
  useWpReflow([reflowKey]);

  useIframeReflow(node?.contentRendered);


  if (!node && !loading) return null;

  // =========================================================
  // 🔹 SANITIZE HTML
  // =========================================================
  const safeHtml = DOMPurify.sanitize(node?.contentRendered || "", {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "scrolling",
      "src",
      "srcdoc",
      "loading",
      "referrerpolicy",
    ],
  });

  // =========================================================
  // 🔹 RENDER
  // =========================================================
  return (
    <>
      {!loading && node?.seo && (
        <Helmet key={`${node?.id}-${node?.uri}`}>
          {node.seo.metaDesc && (
            <meta name="description" content={node.seo.metaDesc} />
          )}
          {node.seo.canonical && (
            <link rel="canonical" href={node.seo.canonical} />
          )}
          {node.seo.opengraphTitle && (
            <meta property="og:title" content={node.seo.opengraphTitle} />
          )}
          {node.seo.opengraphDescription && (
            <meta
              property="og:description"
              content={node.seo.opengraphDescription}
            />
          )}
          {node.seo.opengraphImage?.sourceUrl && (
            <meta
              property="og:image"
              content={node.seo.opengraphImage.sourceUrl}
            />
          )}
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          {node.seo.schema?.raw && (
            <script type="application/ld+json">
              {node.seo.schema.raw}
            </script>
          )}
        </Helmet>
      )}

      <article
        key={node?.id}
        className="wpb-content-wrapper"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </>
  );
}
