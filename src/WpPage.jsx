// src/pages/WpPage.jsx
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
  const wasService = location.state?.wasService === true;

  const { homeData } = useOutletContext() || {};
  const REGIONS = ["okanagan", "calgary", "lowermainland","edmonton","vancouverisland"];

  const cleanPathname = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (REGIONS.includes(parts[0])) parts.shift();
    if (parts[0] === "service") parts.shift();
    if (parts.length === 0) return "/home/";
    return "/" + parts.join("/") + "/";
  }, [pathname]);

  const uri =
    fixedUri ??
    (fixedSlug
      ? `/${fixedSlug}/`
      : wasService
      ? `/service${cleanPathname}`
      : cleanPathname);

  const isHome =
    pathname === "/okanagan" ||
    pathname === "/home" ||
    pathname === "/home/" ||
    pathname === "/calgary" ||
    pathname === "/edmonton" ||
    pathname === "/lowermainland" ||
    pathname === "/vancouverisland";

  const { data, loading, error } = useQuery(NODE_BY_PATH, {
    variables: { uri },
    fetchPolicy: isHome ? "cache-first" : "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: isHome && homeData,
  });

  const node = isHome
    ? homeData?.contentNode || data?.contentNode
    : data?.contentNode;

  useEffect(() => {
    if (isHome) {
      document.title = "Milani Plumbing Heating & Air Conditioning";
    } else if (node?.title) {
      document.title = `${node.title} – Milani Plumbing Heating & Air Conditioning`;
    }
  }, [node?.title, isHome]);

  useWpGlobalAssets();
  useWpBodyAttributesFromWp({ data });
  usePageCss(node);
  useWpReflow([node?.id || null]);
  useIframeReflow(node?.contentRendered);

  if (error) {
    console.warn("GraphQL error (no bloqueante):", error);
  }

  if (!node && !loading) return null;

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
