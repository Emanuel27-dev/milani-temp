import logo from "./../../assets/logoFooter.svg";
import wsspIcon from "./../../assets/Phone.svg";
import messageIcon from "./../../assets/chat.svg";
import tuerca from "./../../assets/tuerca.svg";
import bbb from "./../../assets/bbb.svg";
import hoja from "./../../assets/hoja.svg";

export function Footer() {
  return (
    <>
      <div className="headFooter">
        <div className="container">
          <div className="head">
            <figure className="figureFooter">
              <img src={logo} alt="logo footer" className="imgFooter" />
            </figure>
            <div className="buttons">
              <div className="buttons-block">
                <div className="button">
                  <img src={wsspIcon} alt="whatsapp" />
                  <span>250.900.900</span>
                </div>
                <div className="button button-book">BOOK NOW</div>
              </div>
              <div className="button button-chat">
                <img src={messageIcon} alt="message" />
                <span>CHAT WITH US</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="footer">
        <div class="container">
          <div class="footer-header">
            <h4>Fast, Fair and Reliable Service is our Promise</h4>
          </div>

          <div class="services-grid">
            <div class="service-column">
              <h3>Plumbing</h3>
              <ul>
                <li>
                  <a href="#">Maintenance and Repair</a>
                </li>
                <li>
                  <a href="#">Hot Water Heater</a>
                </li>
                <li>
                  <a href="#">Water Main Replacement</a>
                </li>
                <li>
                  <a href="#">Installations</a>
                </li>
                <li>
                  <a href="#">Trenchless Pipe Repair</a>
                </li>
              </ul>
            </div>

            <div class="service-column">
              <h3>Drainage</h3>
              <ul>
                <li>
                  <a href="#">Drain Tile Systems</a>
                </li>
                <li>
                  <a href="#">Drainage and Sewer Maintenance</a>
                </li>
                <li>
                  <a href="#">Draintile & Sewer Inspection</a>
                </li>
                <li>
                  <a href="#">Pressure Jetting & Cleaning</a>
                </li>
                <li>
                  <a href="#">Drainage Lines Repair & Service</a>
                </li>
                <li>
                  <a href="#">Vacuum Truck Service</a>
                </li>
                <li>
                  <a href="#">Drainage & Sewer Installation</a>
                </li>
              </ul>
            </div>

            <div class="service-column">
              <h3>Heating</h3>
              <ul>
                <li>
                  <a href="#">Furnaces</a>
                </li>
                <li>
                  <a href="#">Boilers</a>
                </li>
                <li>
                  <a href="#">Heat Pumps</a>
                </li>
                <li>
                  <a href="#">Green Heating Solutions</a>
                </li>
                <li>
                  <a href="#">Air Filters</a>
                </li>
              </ul>
            </div>

            <div class="service-column">
              <h3>Air Conditioning</h3>
              <ul>
                <li>
                  <a href="#">Air Conditioning Units</a>
                </li>
                <li>
                  <a href="#">Repair and Replacement</a>
                </li>
                <li>
                  <a href="#">Ductless Mini Splits</a>
                </li>
                <li>
                  <a href="#">Heat Pumps</a>
                </li>
              </ul>
            </div>

            <div class="service-column with-border">
              <div className="little-border">
                <ul>
                  <li>
                    <a href="#">Promotions</a>
                  </li>
                  <li>
                    <a href="#">Commercial Service</a>
                  </li>
                  <li>
                    <a href="#">Rebate Information</a>
                  </li>
                  <li>
                    <a href="#">Careers</a>
                  </li>
                  <li>
                    <a href="#">Payments</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="contact-section">
            <div className="contact-box1">
              <div class="contact-info">
                <h3>Okanagan Service</h3>
                <div class="phone">250-800-0000</div>
                <div class="email">customerservice@milani.ca</div>
              </div>
              <figure className="bbb-figure">
                <img src={bbb} alt="bbb" />
              </figure>
            </div>
            <div className="badges2">
              <div class="tsbc-info">
                <img src={tuerca} alt="tuerca" />
                <span>TSBC Licence: LEL0209964 / LGA0001985</span>
              </div>
            </div>
            <div className="canadian-business">
              <figure>
                <img
                  src={hoja}
                  alt="hoja"
                  className="canadian-bussiness__img"
                />
              </figure>
              <span>A Family Owned Canadian Business</span>
            </div>
          </div>

          <div class="footer-bottom">
            <p>
              © 2008 - 2025 Milani Plumbing, Heating & Air Conditioning. All
              rights reserved. View our <span>Privacy</span> &{" "}
              <span>Security Policy</span>
            </p>
            <p>
              ® ™ Trademarks of AM Royalties Limited Partnership used under
              license by LoyaltyOne, Co. and Milani Plumbing, Heating & Air
              Conditioning.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
