import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Logo from "../resources/logo.svg?react";
import "./navbarStyle.css";
import { CgProfile } from "react-icons/cg";
import { Context } from "../store/context";
import Dropdown from "react-bootstrap/Dropdown";
import toast from "react-hot-toast";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Badge from 'react-bootstrap/Badge';


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
    <Navbar expand="lg" className="navbar-reuplan">
      <Container fluid>
        <Link className="navbar-brand fw-bold d-inline" to="/">
          <Logo width={30} height={35} fill="#f18805" />{" "}
          <span className="text-primary fw-bold">Reu</span>
          <span className="fw-bold text-success">plan</span>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <ul className="navbar-nav  me-auto mb-2 mb-md-0 ">
            <li className="nav-item me-2" key="navbar1">
              <Link
                className={
                  store.pending > 0
                    ? "pending nav-link fw-semibold"
                    : "nav-link fw-semibold"
                }
                to="/eventList"
              >
                Mis Reuniones
                {store.pending > 0 ? (
                  <Badge pill bg="danger" className="mx-1">
                    {store.pending}
                  </Badge>
                ) : (
                  <></>
                )}
              </Link>
            </li>
            <li className="nav-item " key="navbar2">
              <Link className="nav-link fw-semibold" to="/create">
                Crear Evento
              </Link>
            </li>
          </ul>
          <Dropdown>
            <Dropdown.Toggle variant="primary fs-6 fw-semibold" id="dropdown-basic">
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LoggedInNavbar;
