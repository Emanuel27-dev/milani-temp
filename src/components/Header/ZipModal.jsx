import layerLupa from "./../../assets/Layer.svg";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export const GET_GEO_DATA = gql`
  query {
    wpcmRegions {
      id
      title
      slug
      cities {
        name
        slug
        region
      }
    }
    wpcmCities {
      name
      slug
      region
      regionTitle
    }
    posts {
      nodes {
        id
        title
        city {
          name
          slug
          region
          regionTitle
        }
      }
    }
  }
`;

export function ZipModal({
  isOpen,
  onClose,
  setCurrentLocation,
  currentLocation,
}) {
  const { data, loading, error } = useQuery(GET_GEO_DATA);
  if (loading) return <p></p>;
  if (error) return <p>Error: {error.message}</p>;

  const { wpcmRegions, wpcmCities, posts } = data;
  if (!isOpen) return null;

  const handleItem = (city) => {
    setCurrentLocation(city);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>

          <div className="modal-header-custom">
            <img src={layerLupa} alt="" />
            <h6>Find services near you</h6>
          </div>

          <div className="modal-body-custom">
            {wpcmRegions
              .filter(({ cities }) => cities.length > 0) // ⬅️ NO mostrar regiones vacías
              .map(({ title, id, cities }) => (
                <div key={id} className="modal-item">
                  <h5 className="modal-item-title">{title}</h5>

                  <div className="locations-grid">
                    {cities.map(({ name }) => (
                      <div
                        key={name}
                        className={`location-item ${
                          currentLocation === name
                            ? "active-currentLocation"
                            : ""
                        }`}
                        onClick={() => handleItem(name)}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
