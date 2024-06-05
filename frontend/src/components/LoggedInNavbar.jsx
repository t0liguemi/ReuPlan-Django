import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Logo from "../resources/logo.svg?react";
import ColoredLogo from "../resources/logo_colored.svg?react";
import "./navbarStyle.css";
import { CgProfile } from "react-icons/cg";
import { Context } from "../store/context";
import Dropdown from "react-bootstrap/Dropdown";
import toast from "react-hot-toast";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import DropdownButton from "react-bootstrap/DropdownButton";

function LoggedInNavbar() {
  const username = localStorage.getItem("reuPlanUser");
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const showLogoOnly = innerWidth > 600 ? true : false;

  function handleResize() {
    setInnerWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    // actions.userInvitesAndResponses();
    if (store.pending > 0) {
      toast("Tienes invitaciones pendientes");
    }
  }, []);

  return (
    <Navbar className="navbar-reuplan">
      <Container fluid>
        <Link className="navbar-brand fw-bold d-inline px-0 me-1" to="/">
          {showLogoOnly ? (
            <>
              <ColoredLogo width={30} height={35} fill="#f18805" />
              <span className="text-primary fw-bold">Reu</span>
              <span className="fw-bold text-success">plan</span>
            </>
          ) : (
            <ColoredLogo
              width={30}
              height={35}
              fill="#f18805"
              className="p-0"
            />
          )}
        </Link>
          <ul className="d-flex align-items-baseline navbar-nav me-auto mb-2 mb-md-0 ">
            <li className="nav-item px-1" key="navbar1">
              <Link
                className={
                  store.pending > 0
                    ? "pending nav-link"
                    : "nav-link"
                }
                to="/dashboard"
              >
                Eventos
                {store.pending > 0 ? (
                  <Badge pill bg="danger" className="mx-1">
                    {store.pending}
                  </Badge>
                ) : (
                  <></>
                )}
              </Link>
            </li>
            <li className="nav-item px-1" key="navbar2">
              <Link className="nav-link" to="/create">
                Nuevo
              </Link>
            </li>
          </ul>
          <Dropdown>
            <DropdownButton
              variant="primary fs-6 fw-semibold"
              id="dropdown-basic"
              title={username}
              align="end"
            >
              <Dropdown.Item onClick={() => navigate("profile")}>
                Mi cuenta
              </Dropdown.Item>
              <Dropdown.Item
                tovariant="fw-semibold"
                onClick={() => actions.logout(navigate)}
              >
                Cerrar Sesión
              </Dropdown.Item>
            </DropdownButton>
            <Dropdown.Menu></Dropdown.Menu>
          </Dropdown>
      </Container>
    </Navbar>
  );
}

export default LoggedInNavbar;
