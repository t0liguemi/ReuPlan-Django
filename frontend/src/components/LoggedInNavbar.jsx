import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Logo from "../resources/logo.svg?react";
import "./navbarStyle.css";
import { CgProfile } from "react-icons/cg";
import { Context } from "../store/context";
import Dropdown from "react-bootstrap/Dropdown";
import toast from "react-hot-toast";

function LoggedInNavbar() {
  const username = localStorage.getItem("reuPlanUser");
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  useEffect(() => {
    actions.userInvitesAndResponses();
    if (store.pending > 0) {
      toast("Tienes invitaciones pendientes");
    }
  }, []);

  return (
    <nav
      className="sticky-top navbar navbar-expand-md border"
      id="navbar-yessir"
      aria-label="Fourth navbar example"
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold d-inline" to="/">
          <Logo width={30} height={35} fill="#f18805" />{" "}
          <span className="text-primary fw-bold">Reu</span>
          <span className="fw-bold text-success">plan</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample04"
          aria-controls="navbarsExample04"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse  " id="navbarsExample04">
          <ul className="navbar-nav  me-auto mb-2 mb-md-0 ">
            <li className="nav-item me-3" key="2">
              <Link
                className={
                  store.pending > 0
                    ? "pending nav-link fw-semibold position-relative"
                    : "nav-link fw-semibold position-relative"}
                to="/eventList"
              >
                Mis Reuniones
                {store.pending > 0 ?<span className="position-absolute top-75 start-100 translate-middle badge rounded-pill bg-danger fw-semibold">
                  {store.pending}
                </span>:""}
                
              </Link>
            </li>
            <li className="nav-item " key="1">
              <Link className="nav-link fw-semibold" to="/create">
                Crear Evento
              </Link>
            </li>
          </ul>
          <Dropdown>
            <Dropdown.Toggle variant="primary fs-5" id="dropdown-basic">
              {username + " "}
              <CgProfile />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate("profile")}>
                Mi cuenta
              </Dropdown.Item>
              <Dropdown.Item
                tovariant="fw-semibold"
                onClick={() => actions.logout(navigate)}
              >
                Cerrar Sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}

export default LoggedInNavbar;
