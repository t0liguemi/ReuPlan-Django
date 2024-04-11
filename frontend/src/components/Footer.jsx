import Logo from "../resources/logo.svg?react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

function Footer() {
  const [dangerousCounter, setDangerousCounter] = useState(0);
  function handleEasterEgg() {
    if (dangerousCounter === 11) {
      setDangerousCounter(0);
    } else {
      setDangerousCounter(dangerousCounter + 1);
    }
  }

  return dangerousCounter !== 11 ? (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-2 mt-4 bg-success px-4 fw-semibold mt-auto">
      <p className="col-md-4 mb-0 text-white">
        Reuplan, 2024.{" "}
        <span
          onClick={() => {
            handleEasterEgg();
          }}
          className="text-body easterEgg"
        >
          t{dangerousCounter}liguemi.
        </span>
      </p>

      <Link
        to="/"
        className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
      >
        <Logo
          className="bi me-2 my-2"
          width="40"
          height="32"
          fill="white"
        ></Logo>
      </Link>

      <ul className="nav col-md-4 justify-content-end">
        <li className="nav-item" key="footer-1">
          <Link
            to="https://www.youtube.com/watch?v=p8vgaGH6w5A"
            className="nav-link px-2 text-white"
          >
            Funcionamiento
          </Link>
        </li>
        <li className="nav-item" key="footer-2">
          <Link
            onClick={() => {
              toast("Es gratis!", { position: "top-left", icon: "👏" });
              toast.success("Es gratis!", {
                position: "top-center",
                icon: "👏",
              });
              toast.error("Es gratis!", { icon: "👏" });
              toast.success("Es gratis!", {
                position: "bottom-center",
                icon: "👏",
              });
              toast("Es gratis!", { position: "top-right", icon: "👏" });
              toast.error("Es gratis!", {
                position: "bottom-left",
                icon: "👏",
              });
            }}
            className="nav-link px-2 text-white"
          >
            Precios
          </Link>
        </li>
        {/* <li className="nav-item" key="footer-3">
            <Link to="/about#FAQ" className="nav-link px-2 text-white">
              FAQ
            </Link>
          </li> */}
        <li className="nav-item" key="footer-4">
          <Link
            to="mailto:merengueconjamon@gmail.com"
            className="nav-link px-2 text-white"
          >
            Comentarios/Reportes
          </Link>
        </li>
      </ul>
    </footer>
  ) : (
    <img
      onClick={() => handleEasterEgg()}
      className="easterEggOverlay"
      src="https://i.ibb.co/txDtg31/photo-2022-09-13-00-07-01.jpg"
    />
  );
}
export default Footer;
