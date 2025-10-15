import styles from "./styles/footer.module.css";
import logo from "./../../assets/LogoMilaniFooter.png";
import wsspIcon from "./../../assets/wassp.png";
import messageIcon from "./../../assets/message.png";
import tuerca from "./../../assets/tuerca.png";
import bbb from "./../../assets/bbb.png";
import hoja from "./../../assets/hoja.png";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.headFooter}>
        <div className={styles.container}>
          <div className={styles.head}>
            <figure className={styles.figureFooter}>
              <img src={logo} alt="logo footer" className={styles.imgFooter} />
            </figure>
            <div className={styles.buttons}>
              <div className={styles.button}>
                <img src={wsspIcon} alt="whatsapp" />
                <span>250.900.900</span>
              </div>
              <div className={styles.button}>BOOK NOW</div>
              <div className={styles.button}>
                <img src={messageIcon} alt="message" />
                <span>CHAT WITH US</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.tailFooter}>
        <div className={styles.container}>
          <div className={styles.tail}>
            <div className={styles.tailCont}>
              <h2 className={styles.tailTitle}>
                Fast, Fair and Reliable Service is our Promise
              </h2>
              <div className={styles.firstBlock}>
                <div>
                  <h3 className={styles.categoryTitle}>Plumbing</h3>
                  <div className={styles.contChildsCategory}>
                    <div className={styles.childCategory}>
                      Maintenance and Repair
                    </div>
                    <div className={styles.childCategory}>Hot Water Heater</div>
                    <div className={styles.childCategory}>
                      Water Main Replacement
                    </div>
                    <div className={styles.childCategory}>Installations</div>
                    <div className={styles.childCategory}>
                      Trenchless Pipe Repair
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className={styles.categoryTitle}>Drainage</h3>
                  <div className={styles.contChildsCategory}>
                    <div className={styles.childCategory}>
                      Drain Tile Systems
                    </div>
                    <div className={styles.childCategory}>
                      Drainage and Sewer Maintenance
                    </div>
                    <div className={styles.childCategory}>
                      Draintile & Sewer Inspection
                    </div>
                    <div className={styles.childCategory}>
                      Pressure Jetting & Cleaning
                    </div>
                    <div className={styles.childCategory}>
                      Drainage Lines Repair & Service
                    </div>
                    <div className={styles.childCategory}>
                      Vacuum Truck Service
                    </div>
                    <div className={styles.childCategory}>
                      Drainage & Sewer Installation
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className={styles.categoryTitle}>Heating</h3>
                  <div className={styles.contChildsCategory}>
                    <div className={styles.childCategory}>Furnaces</div>
                    <div className={styles.childCategory}>Boilers</div>
                    <div className={styles.childCategory}>Heat Pumps</div>
                    <div className={styles.childCategory}>
                      Green Heating Solutions
                    </div>
                    <div className={styles.childCategory}>Air Filters</div>
                  </div>
                </div>
                <div>
                  <h3 className={styles.categoryTitle}>Air Conditioning</h3>
                  <div className={styles.contChildsCategory}>
                    <div className={styles.childCategory}>
                      Air Conditioning Units
                    </div>
                    <div className={styles.childCategory}>
                      Repair and Replacement
                    </div>
                    <div className={styles.childCategory}>
                      Ductless Mini Splits
                    </div>
                    <div className={styles.childCategory}>Heat Pumps</div>
                  </div>
                </div>
                <div>
                  <div className={styles.contChildsCategory}>
                    <div className={styles.childCategory}>Promotions</div>
                    <div className={styles.childCategory}>
                      Commercial Service
                    </div>
                    <div className={styles.childCategory}>
                      Rebate Information
                    </div>
                    <div className={styles.childCategory}>Careers</div>
                    <div className={styles.childCategory}>Payments</div>
                  </div>
                </div>
              </div>

              <div className={styles.secondBlock}>
                <div className={styles.secondBlock1}>
                  <div className={styles.bloquecito}>
                    <div className={styles.bloquecitoChild}>
                      <h2 className={styles.empresa}>Okanagan Service</h2>
                      <p className={styles.number}>250-800-0000</p>
                    </div>
                    <span className={styles.email}>
                      customerservice@milani.ca
                    </span>
                  </div>
                  <figure>
                    <img src={bbb} alt="bbb" />
                  </figure>
                  <div className={styles.tuerquita}>
                    <img
                      src={tuerca}
                      alt="tuerca"
                      className={styles.tuerquitaImg}
                    />
                    <p className={styles.tuerquitaText}>
                      TSBC Licence: LEL0209964 / LGA0001985
                    </p>
                  </div>
                </div>
                <div className={styles.secondBlock2}>
                  <figure className={styles.hojaFigure}>
                    <img src={hoja} alt="hoja" className={styles.hoja} />
                  </figure>
                  <h2>A Family Owned Canadian Business</h2>
                </div>
              </div>

              <div className={styles.thirdBlock}>
                <div>
                  © 2008- 2025 Milani Plumbing, Heating & Air Conditioning. All
                  rights reserved. View our{" "}
                  <span className={styles.span}>Privacy</span> &{" "}
                  <span className={styles.span}>Security Policy</span>
                </div>
                <div>
                  ® ™ Trademarks of AM Royalties Limited Partnership used under
                  license by LoyaltyOne, Co. and Milani Plumbing, Heating & Air
                  Conditioning.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
