import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "react-router-dom";
import DOMPurify from "dompurify";

// GraphQL query para traer un Global Section por slug
const GET_GLOBAL_SECTION = gql`
  query GetGlobalSection($slug: String!) {
    salientGlobalSection(slug: $slug) {
      title
      slug
      contentRendered
    }
  }
`;

export function CityGlobalSection() {
  const [params] = useSearchParams();
  const city = params.get("city") || "kelowna"; // valor por defecto
  const slug = `${city}`;

  const { data, loading, error } = useQuery(GET_GLOBAL_SECTION, {
    variables: { slug },
  });

  if (loading) return null;
  if (error) return <p>Error cargando el slider de ciudad.</p>;
  if (!data?.salientGlobalSection) return null;

  const html = DOMPurify.sanitize(data.salientGlobalSection.contentRendered || "");

  return (
    <div
      id={`slider-${city}`}
      className="global-section"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
