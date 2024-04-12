import { Link, useNavigate, Navigate } from "react-router-dom";
import Logo from "../resources/logo.svg?react";
import { useContext, useEffect, useState } from "react";
import { Context } from "../store/context";

function Login() {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [readyForRender, setReadyForRender] = useState(false);

  function login(e) {
    actions.loginAttempt(e, navigate);
  }

  useEffect(() => {
    if (store.loggedIn) {
      navigate("/eventList");
    } else {
      setReadyForRender(true);
    }
  }, []);
  if (readyForRender) {
    return (
      <div className="container">
        <form className="w-50 mx-auto my-5">
          <div className="d-flex justify-content-center">
            <Logo height={150} fill="#f18805" className="mx-auto" />
          </div>
          <h1 className="h3 mb-3 mt-3 fw-normal"></h1>
          <div className="form-floating">
            <input
              type="text"
              className="form-control m-2 py-2 fw-semibold text-center"
              id="floatingInput"
              placeholder="nombre de usuario"
            />
            <label htmlFor="floatingPassowrd" className="">
              Nombre de usuario
            </label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control text-center m-2"
              id="floatingPassword"
              placeholder="Password"
            />
            <label>Contraseña</label>
          </div>
          <button
            className="btn btn-primary w-100 m-2 py-2 fw-semibold"
            onClick={(e) => login(e)}
          >
            Ingresar
          </button>
          <Link
            to="/signin"
            className="btn btn-outline-primary py-3 my-3 mx-2 w-100 text-primary fw-semibold"
          >
            Crear Cuenta
          </Link>
        </form>
      </div>
    );
  }
}

export default Login;
