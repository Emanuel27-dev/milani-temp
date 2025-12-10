import layerLupa from "./../../assets/Layer.svg";

const locations = [
  {
    region: "Okanagan",
    cities: ["Kelowna", "West Kelowna", "Lake Country"],
  },
  {
    region: "Alberta",
    cities: [
      "Grande Prairie",
      "Fort McMurray",
      "Peace River",
      "High Level",
      "Edmonton",
      "St. Albert",
    ],
  },
  {
    region: "Lower Mainland",
    cities: ["Vancouver", "Burnaby", "Richmond", "Surrey", "Coquitlam"],
  },
];

export function ZipModal({
  isOpen,
  onClose,
  setCurrentLocation,
}) {

  if (!isOpen) return null;

 const handleItem = (city) => {
  setCurrentLocation(city)
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
                  {cities.map((city) => (
                    <div 
                      key={city}
                      className="location-item"
                      onClick={() => handleItem(city)}  
                    >
                      {city}
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