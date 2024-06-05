import React, { useContext } from "react";
import { Context } from "../store/context";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  const { testerKey, newUsername } = useParams();
  const { store, actions } = useContext(Context);
  return (
    <div className="container py-3">
      <h1 className="fw-semibold">Nueva cuenta</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          actions.createUser(e, navigate);
        }}
      >
        <fieldset>
          <div className="row my-3">
            <div className="col-sm-12 col-md-6 d-flex align-items-end">
              <label className="fw-semibold w-75">
                Nombre de usuario
                <input
                  id="formUsername"
                  className="text form-control my-2"
                  placeholder="nombre de usuario"
                  required
                ></input>
              </label>
            </div>
            <div className="col-sm-12 col-md-6 d-flex align-items-end">
              <label className="fw-semibold w-75">
                E-Mail
                <input
                  id="formEmail"
                  className="text my-2 form-control"
                  placeholder="e-mail"
                  required
                ></input>
              </label>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-sm-12 col-md-6 d-flex align-items-end">
              <label className="fw-semibold w-75">
                Contraseña
                <input
                  id="formPassword"
                  type="password"
                  className="text my-2 form-control"
                  placeholder="contraseña"
                  required
                ></input>
              </label>
            </div>
            <div className="col-sm-12 col-md-6 d-flex align-items-end">
              <label className="fw-semibold w-75">
                Confirmar contraseña
                <input
                  id="formPassword2"
                  type="password"
                  className="text my-2 form-control"
                  placeholder="contraseña"
                  required
                ></input>
              </label>
            </div>
          </div>
          <hr className="my-4"></hr>
          <div className="row gap-5 my-4">
            <div className="col">
              <label className="fw-semibold w-75">
                Nombre
                <input
                  id="nameInput"
                  className="text form-control my-2"
                  placeholder="nombre"
                  defaultValue={newUsername}
                ></input>
              </label>
            </div>
          </div>
          {/* <h6 className="fw-semibold">*Cambios en estos datos requerirán que vuelvas a ingresar</h6> */}
          <button
            className="row btn btn-primary px-5 my-2 fw-semibold fs-5 mx-2"
            type="submit"
          >
            {/* actions.createUser(e,navigate)}> */}
            Confirmar
          </button>
          <small className="row fw-light mx-2">
            Recibirás un correo con instrucciones para activar tu cuenta
          </small>
        </fieldset>
      </form>
    </div>
  );
};

export default SignIn;
