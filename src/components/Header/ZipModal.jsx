import { useState } from "react";
import lupa from "./../../assets/lupa2.svg";
import locationIcon from "./../../assets/location2.svg";

const locations = [
  "Vancouver",
  "Coquitlam",
  "West Vancouver",
  "White Rock",
  "Burnaby",
  "Langley",
  "New Westminster",
  // "Maple Ridge",
  "Surrey",
  "Delta",
  "Port Coquitlam",
  "Pitt Meadows",
  "Richmond",
  "North Vancouver",
  "Port Moody",
  "Tsawwassen"
];


export function ZipModal({ isOpen, onClose, currentLocation, setCurrentLocation }) {
  const [searchDone, setSearchDone] = useState(false);
  const [selected, setSelected] = useState(currentLocation);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    // Aquí podrías hacer una llamada a la API de búsqueda por ZIP.
    // Por ahora solo simulamos el resultado:
    setSearchDone(true);
  };

  const handleConfirm = () => {
    setCurrentLocation(selected);
    setSearchDone(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic dentro
      >
        <button
          className="modal__close"
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="modal__content">
          <h6 className="modal__title">Find services near you</h6>
          <p className="modal__subtitle">
            Enter your ZIP code to show available technicians and services in
            your area.
          </p>

          <form className="zip-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="zip-form__input"
              placeholder="Enter your ZIP code"
              required
            />
            <button className="zip-form__btn" type="submit">
              <img src={lupa} alt="" className="zip-form__icon" />
              Search
            </button>
          </form>

          {/* Resultado de búsqueda */}
          {searchDone && (
            <div className="zip-results">
              <div className="zip-results__header">
                <img
                  src={locationIcon}
                  alt="icon"
                  className="zip-results__icon"
                />
                <p>We found {locations.length} Lower Mainland Locations</p>
              </div>

              <div className="zip-results__options">
                {locations.map((city) => (
                  <label key={city} className="zip-results__option">
                    <input
                      type="radio"
                      name="location"
                      value={city}
                      checked={selected === city}
                      onChange={() => setSelected(city)}
                    />
                    {city}
                  </label>
                ))}
              </div>

              <button className="zip-results__confirm" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
