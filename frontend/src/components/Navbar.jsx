import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import Logo from "../resources/logo.svg?react";
import "./navbarStyle.css";
import { Context } from "../store/context";
import LoggedInNavbar from "./LoggedInNavbar";

function Navbar() {
  const { store, actions } = useContext(Context);
  useEffect(() => {}, [store.loggedIn]);
  if (store.loggedIn == true) {
    return <LoggedInNavbar />;
  } else if (store.loggedIn == false) {
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

          <Link
            to="/login"
            className="btn btn-primary fs-6 fw-semibold"
            id="login-btn"
          >
            Iniciar Sesión
          </Link>
        </div>
      </nav>
    );
  }
}

export default Navbar;
