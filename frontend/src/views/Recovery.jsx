import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";

function Recovery() {
  const backendURL = import.meta.env.DEV
    ? import.meta.env.VITE_APP_BACKEND_URL
    : "";

  const [nextStep, setNextStep] = useState(false);
  const [recoveringUsername, setRecoveringUsername] = useState("");

  function handleSubmitUsername(e) {
    console.log(e.target.recoveryUsername.value);
    fetch(backendURL + "api/recovery/key/create", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        user: e.target.recoveryUsername.value,
      }),
    }).then((response) => {
      if (response.status === 201) {
        toast.success(
          "Se ha enviado un correo con una clave para recuperación"
        );
        setNextStep(true);
        setRecoveringUsername(e.target.recoveryUsername.value);
      }
    });
  }

  function recoveryCodeSubmit(e) {
    e.preventDefault();
    const key =
      e.target.recoveryCode1.value +
      e.target.recoveryCode2.value +
      e.target.recoveryCode3.value +
      e.target.recoveryCode4.value +
      e.target.recoveryCode5.value +
      e.target.recoveryCode6.value +
      e.target.recoveryCode7.value +
      e.target.recoveryCode8.value;
    fetch(backendURL + "api/recovery/key/attempt", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: recoveringUsername,
        key: key.toUpperCase(),
      }),
    }).then((response) => {
      if (response.status === 200) {
        toast(
          "Si es que existe una cuenta con ese correo, recibirá un correo con la información solicitada"
        );
      }
    });
  }

  function handleSubmitEmail(e) {
    console.log(e.target.recoveryEmail.value);
    fetch(backendURL + "api/recovery/username", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: e.target.recoveryEmail.value,
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
      {!nextStep && (
        <>
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
                <input
                  className="form-control"
                  id="recoveryUsername"
                  required
                />
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
              No lo recuerdas? Ingresa tu email, recibirás el nombre de usuario
              en esa dirección.
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
              </label>
              <button
                className="py-2 mx-2 btn btn-primary fw-semibold"
                type="submit"
              >
                Continuar
              </button>
            </form>
            <div>
              <small>
                En caso de que no recuerdes ambos datos, utiliza el
                <Link to="/contact">formulario de contacto</Link> para
                comunicarte con nosotros y resolver tu caso directamente.
              </small>
            </div>
          </div>
        </>
      )}
      {nextStep && (
        <>
          <div className="my-3">
            <form
              className="container d-flex flex-column align-items-center"
              onSubmit={(e) => {
                recoveryCodeSubmit(e);
              }}
            >
              <h4 className="fw-normal">
                Ingresa el código para el usuario{" "}
                <span className="fw-semibold">{recoveringUsername}</span>
              </h4>
              <div className="container d-flex bg-light p-2 rounded">
                <input
                  style={{ textTransform: "uppercase" }}
                  id="recoveryCode1"
                  className="col fs-4 form-control mx-1 text-center"
                  maxLength={1}
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode2"
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode3"
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode4"
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode5"
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode6"
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode7"
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode8"
                />
              </div>
              <button
                className="btn btn-primary my-4 w-50 fw-semibold"
                type="submit"
              >
                Confirmar
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
export default Recovery;
