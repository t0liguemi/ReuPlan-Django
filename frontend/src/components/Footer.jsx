import Logo from "../resources/logo.svg?react"
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="mt-auto">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-2 mt-4 bg-success px-4 fw-semibold">
        <p className="col-md-4 mb-0 text-white">Reuplan, 2024</p>

        <Link
          to="/"
          className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <Logo className="bi me-2 my-2" width="40" height="32" fill="white"></Logo>
        </Link>

        <ul className="nav col-md-4 justify-content-end">
          <li className="nav-item" key="footer-1">
            <Link to="/about#Features" className="nav-link px-2 text-white">
              Funcionamiento
            </Link>
          </li>
          <li className="nav-item" key="footer-2">
            <Link to="/about#Pricing" className="nav-link px-2 text-white">
              Precios
            </Link>
          </li>
          <li className="nav-item" key="footer-3">
            <Link to="/about#FAQ" className="nav-link px-2 text-white">
              FAQ
            </Link>
          </li>
          <li className="nav-item" key="footer-4">
            <Link to="/about" className="nav-link px-2 text-white">
              Nosotros
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}
export default Footer;
