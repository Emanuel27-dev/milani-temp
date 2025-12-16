import { useLocation, useNavigate } from "react-router-dom";
import { locations } from "../../locations";
import layerLupa from "./../../assets/Layer.svg";

export function ZipModal({
  isOpen,
  onClose,
  setCurrentLocation,
  setCurrentPhone,
  setCurrentRegion
}) {

  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  // Normalizar de Lower Mainland -> lowermaindland 
  const regionToSlug = (region) =>
  region.toLowerCase().replace(/\s+/g, "");


 const handleItem = (city, phone, region) => {

  const regionSlug = regionToSlug(region);
  setCurrentLocation(city);
  setCurrentPhone(phone);
  setCurrentRegion(region);
  localStorage.setItem("currentPhone", phone);
  localStorage.setItem("currentRegion", regionSlug);

  // path actual (ej: /service/plumbing/installations)
  const currentPath = location.pathname;

    // quitar región previa si ya existe
  const cleanPath = currentPath.replace(
    /^\/(okanagan|alberta|lowermainland)/,
    ""
  );

  navigate(`/${regionSlug}${cleanPath}`);
  onClose();
 }

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
            {locations.map(({ region, cities }) => (
              <div key={region} className="modal-item">
                <h5 className="modal-item-title">{region}</h5>

                <div className="locations-grid">
                  {cities.map(({name, phone }) => (
                    <div 
                      key={name}
                      className="location-item"
                      onClick={() => handleItem(name, phone, region)}  
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