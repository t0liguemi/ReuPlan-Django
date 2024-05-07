import { Link } from "react-router-dom";
import { useState } from "react";

function Recovery() {
  const backendURL = import.meta.env.DEV
    ? import.meta.env.VITE_APP_BACKEND_URL
    : "";

  const [nextStep, setNextStep] = useState(false);
  function handleSubmitUsername(e) {
    console.log(e.target.recoveryUsername.value);
    fetch(backendURL + "/recovery/key/create", {
      headers: {
        method: "POST",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
      }),
    }).then((response) => {
      if (response.status === 201) {
        toast.success(
          "Se ha enviado un correo con una clave para recuperación"
        );
        setNextStep(true);
      }
    });
  }
  function handleSubmitEmail(e) {
    console.log(e.target.recoveryEmail.value);
    fetch(backendURL + "/recovery/username", {
      headers: {
        method: "POST",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: event.target.email.value,
      }),
    }).then((response) => {
      if (response.status === 200) {
        toast(
          "Si es que existe una cuenta con ese correo, recibirá un correo con la información solicitada"
        );
      }
    });
  }
  return (
    <div className="container mx-auto my-auto w-50">
      <div className="my-3">
        <h2 className="fw-semibold">
          Ingresa tu nombre de usuario para recuperar tu contraseña:
        </h2>
        <form
          className="d-flex align-items-end"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitUsername(e);
          }}
        >
          <label className="" htmlFor="recoveryUsername">
            Nombre de usuario
            <input className="form-control" id="recoveryUsername" required />
          </label>
          <button
            className="py-2 mx-2 btn btn-primary fw-semibold"
            type="submit"
          >
            Continuar
          </button>
        </form>
      </div>
      <div className="my-3">
        <h4 className="fw-semibold">
          No lo recuerdas? Ingresa tu email, recibirás el nombre de usuario en
          esa dirección.
        </h4>
        <form
          className="d-flex align-items-end"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitEmail(e);
          }}
        >
          <label className="" htmlFor="recoveryEmail">
            Dirección de email
            <input className="form-control" id="recoveryEmail" required />
          </label>{" "}
          <button
            className="py-2 mx-2 btn btn-primary fw-semibold"
            type="submit"
          >
            Continuar
          </button>
        </form>
        <div>
          {" "}
          <small>
            En caso de que no recuerdes ambos datos, utiliza el{" "}
            <Link to="/contact">formulario de contacto</Link> para comunicarte
            con nosotros y resolver tu caso directamente.
          </small>
        </div>
      </div>
    </div>
  );
}
export default Recovery;
