import React, { useContext } from "react";
import { Context } from "../store/context";
import { useNavigate } from "react-router";

const SignIn = () => {
  const navigate = useNavigate() 

  const {store,actions}=useContext(Context)
  return (
    <div className="container py-3">
      <h1 className="fw-semibold">Nueva cuenta</h1>
      <form onSubmit={(e)=>{e.preventDefault();actions.createUser(e,navigate)}}>
        <fieldset>
        <div className="row gap-5 my-4">
          <div className="col">
            <label className="col fw-semibold">
              Nombre de usuario
            </label>
            <small className="text-secondary fw-semibold mx-2">Este valor no es modificable una vez creada la cuenta</small>
            <input
              id="formUsername"
              className="text form-control my-2"
              placeholder="nombre de usuario"
              required
            ></input>
          </div>
          <div className="col">
            <label className="fw-semibold">
              Contraseña
            </label>
            <input
              id="formPassword"
              type="password"
              className="text my-2 form-control"
              placeholder="contraseña"
              required
            ></input>
          </div>
        </div>
        <div className="row gap-5 my-4">
          <div className="col">
            <label className="fw-semibold">
              E-Mail
            </label>
            <small className="text-secondary fw-semibold mx-2">Este valor no es modificable una vez creada la cuenta</small>
            <input
              className="text my-2 form-control"
              placeholder="e-mail"
              required
            ></input>
          </div>
          <div className="col">
            <label className="fw-semibold">
              Confirmar contraseña
            </label>
            <input
              id="formPassword2"
              type="password"
              className="text my-2 form-control"
              placeholder="contraseña"
              required
            ></input>
          </div>
        </div>
        <hr className="my-4"></hr>
        <div className="row gap-5 my-4">
          <div className="col">
            <label className="col fw-semibold">
              Nombre
            </label>
            <input
              id="nameinput"
              className="text form-control my-2"
              placeholder="nombre"
            ></input>
          </div>
        </div>
        <div className="row gap-5 my-4">
          <div className="col">
            <label className="col fw-semibold">
              Código de Reuplan Tester
            </label>
            <input
              id="betakey"
              className="text form-control my-2"
              placeholder="tu código"
            ></input>
          </div>
        </div>
        {/* <h6 className="fw-semibold">*Cambios en estos datos requerirán que vuelvas a ingresar</h6> */}
        <button className="btn btn-primary px-5 my-2 fw-semibold fs-5" type="submit">
          {/* actions.createUser(e,navigate)}> */}
          Confirmar
        </button>
        </fieldset>
      </form>
    </div>
  );
};

export default SignIn;
