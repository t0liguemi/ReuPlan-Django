import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import Logo from "../resources/logo.svg?react";
import "./navbarStyle.css";
import { Context } from "../store/context";
import LoggedInNavbar from "./LoggedInNavbar";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

function Navbarloggedout() {
  useEffect(() => {}, []);

  return (
    <Navbar expand="lg" className="navbar-reuplan">
      <Container fluid>
        <Link className="navbar-brand fw-bold d-inline" to="/">
          <Logo width={30} height={35} fill="#f18805" />
          <span className="text-primary fw-bold">Reu</span>
          <span className="fw-bold text-success">plan</span>
        </Link>
        <Link
          to="/login"
          className="btn btn-primary fs-6 fw-semibold"
          id="login-btn"
        >
          Iniciar Sesión
        </Link>
      </Container>
    </Navbar>
  );
}

export default Navbarloggedout;
