import layerLupa from "./../../assets/Layer.svg";

// const locations = [
//   {
//     region: "Okanagan",
//     cities: ["Kelowna", "West Kelowna", "Lake Country"],
//   },
//   {
//     region: "Alberta",
//     cities: [
//       "Grande Prairie",
//       "Fort McMurray",
//       "Peace River",
//       "High Level",
//       "Edmonton",
//       "St. Albert",
//     ],
//   },
//   {
//     region: "Lower Mainland",
//     cities: ["Vancouver", "Burnaby", "Richmond", "Surrey", "Coquitlam"],
//   },
// ];


const locations = [
  {
    region: "Okanagan",
    cities: [
      { name: "Kelowna",       phone: "250.900.900" },
      { name: "West Kelowna",  phone: "778.901.902" },
      { name: "Lake Country",  phone: "236.903.904" },
    ],
  },
  {
    region: "Alberta",
    cities: [
      { name: "Grande Prairie", phone: "780.700.701" },
      { name: "Fort McMurray",  phone: "587.702.703" },
      { name: "Peace River",    phone: "825.704.705" },
      { name: "High Level",     phone: "780.706.707" },
      { name: "Edmonton",       phone: "587.708.709" },
      { name: "St. Albert",     phone: "825.710.711" },
    ],
  },
  {
    region: "Lower Mainland",
    cities: [
      { name: "Vancouver",  phone: "604.800.801" },
      { name: "Burnaby",    phone: "778.802.803" },
      { name: "Richmond",   phone: "236.804.805" },
      { name: "Surrey",     phone: "604.806.807" },
      { name: "Coquitlam",  phone: "778.808.809" },
    ],
  },
];



export function ZipModal({
  isOpen,
  onClose,
  setCurrentLocation,
  setCurrentPhone,
}) {

  if (!isOpen) return null;

 const handleItem = (city, phone) => {
  setCurrentLocation(city);
  setCurrentPhone(phone);
  localStorage.setItem("currentPhone", phone);
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
                      onClick={() => handleItem(name, phone)}  
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