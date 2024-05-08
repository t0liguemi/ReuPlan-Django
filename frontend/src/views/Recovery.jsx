import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";

function Recovery() {
  const backendURL = import.meta.env.DEV
    ? import.meta.env.VITE_APP_BACKEND_URL
    : "";

  const [recoveryStage, setRecoveryStage] = useState("start");
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
        setRecoveryStage("userFound");
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
    })
      .then((response) => {
        if (response.status === 200) {
          toast("Código de recuperación correcto");
          setRecoveryStage("codeSuccess");
        }
      })
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else if (data.message) {
          toast.success(data.message);
        }
      });
  }

  function handleSubmitEmail(e) {
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

  function handleSubmitPassword(e) {
    e.preventDefault();
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{10,}$/;
    if (!passwordPattern.test(e.target.formPassword.value)){
      toast.error("La contraseña debe tener al menos 10 caracteres, 1 minúscula, 1 mayúscula , un símbolo y un número")
      return;
    }
    if (e.target.formPassword.value != e.target.formConfirmPassword.value){
      toast.error("Las contraseñas no coinciden");
      return;
    }
    fetch(backendURL + "api/user/edit", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: "Token " + localStorage.getItem("reuPlanToken"),
      },
      body: JSON.stringify({username: recoveringUsername, password: e.target.formPassword.value}),
    })
      .then((resp) => {
        if (resp.status === 429) {
          toast.error(
            "Límite de solicitudes excedido, intentalo más tarde"
          );
          return;
        }
        if (resp.status == 200) {
          toast.success("Datos de cuenta actualizados");
          return resp.json();
        }
      })
  }

  return (
    <div className="container mx-auto my-auto w-50">
      {recoveryStage === "start" && (
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
      {recoveryStage === "userFound" && (
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
                  className="col fs-4 p-0 flex-fill  form-control mx-1 text-center"
                  maxLength={1}
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col px-0 flex-fill fs-4 form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode2"
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 px-0 flex-fill form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode3"
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 p-0 flex-fill form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode4"
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 p-0 flex-fill form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode5"
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 p-0 flex-fill form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode6"
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 p-0 flex-fill form-control mx-1 text-center"
                  maxLength={1}
                  id="recoveryCode7"
                />
                <input
                  style={{ textTransform: "uppercase" }}
                  className="col fs-4 p-0 flex-fill form-control mx-1 text-center"
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
      {recoveryStage === "codeSuccess" && (
        <>
          <h4 className="fw-semibold">Ingresa ahora tu nueva contraseña</h4>
          <form
            onSubmit={(e) => {
              handleSubmitPassword(e);
            }}
          >
            <div className="col">
              <label className="fw-semibold" htmlFor="formPassword">
                Contraseña
              </label>
              <input
                id="formPassword"
                type="password"
                className="text my-2 form-control"
              ></input>
            </div>
            <div className="col">
              <label className="fw-semibold" htmlFor="formConfirmPassword">
                Confirmación de contraseña
              </label>
              <input
                id="formConfirmPassword"
                type="password"
                className="text my-2 form-control"
              ></input>
            </div>
            <button className="btn btn-primary my-4 w-50 fw-semibold">
              Confirmar
            </button>
          </form>
        </>
      )}
    </div>
  );
}
export default Recovery;
