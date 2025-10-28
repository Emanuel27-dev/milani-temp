import logo from "./../../assets/LogoMilaniFooter.png";
import wsspIcon from "./../../assets/wassp.png";
import messageIcon from "./../../assets/message.png";
import tuerca from "./../../assets/tuerca.png";
import bbb from "./../../assets/bbb.png";
import hoja from "./../../assets/hoja.png";

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
              <div className="button">
                <img src={wsspIcon} alt="whatsapp" />
                <span>250.900.900</span>
              </div>
              <div className="button">BOOK NOW</div>
              <div className="button">
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
              <li>Maintenance and Repair</li>
              <li>Hot Water Heater</li>
              <li>Water Main Replacement</li>
              <li>Installations</li>
              <li>Trenchless Pipe Repair</li>
            </ul>
          </div>

          <div class="service-column">
            <h3>Drainage</h3>
            <ul>
              <li>Drain Tile Systems</li>
              <li>Drainage and Sewer Maintenance</li>
              <li>Draintile & Sewer Inspection</li>
              <li>Pressure Jetting & Cleaning</li>
              <li>Drainage Lines Repair & Service</li>
              <li>Vacuum Truck Service</li>
              <li>Drainage & Sewer Installation</li>
            </ul>
          </div>

          <div class="service-column">
            <h3>Heating</h3>
            <ul>
              <li>Furnaces</li>
              <li>Boilers</li>
              <li>Heat Pumps</li>
              <li>Green Heating Solutions</li>
              <li>Air Filters</li>
            </ul>
          </div>

          <div class="service-column">
            <h3>Air Conditioning</h3>
            <ul>
              <li>Air Conditioning Units</li>
              <li>Repair and Replacement</li>
              <li>Ductless Mini Splits</li>
              <li>Heat Pumps</li>
            </ul>
          </div>

          <div class="service-column with-border">
            <h3></h3>
            <ul>
              <li>Promotions</li>
              <li>Commercial Service</li>
              <li>Rebate Information</li>
              <li>Careers</li>
              <li>Payments</li>
            </ul>
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
              <img src={hoja} alt="hoja" />
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
