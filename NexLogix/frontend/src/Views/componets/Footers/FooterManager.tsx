import "../../Styles/Footers/footerGeneral.css"
import { Link } from "react-router-dom";
const FooterGeneralManager = () => {
  return (
    <>
      <footer className="footer mt-auto pt-4 w-100 text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="footer-card">
                <Link className="footer-link" to="/Manager/ubicacion">
                  Estamos ubicados en
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="footer-card">
                <Link className="footer-link" to="/Manager/acerca_de">
                  Acerca de
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col text-center">
              <p className="footer-copyright">
                NEXLOGIX © · Optimizando tu logística
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};


export default FooterGeneralManager;
