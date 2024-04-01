import { useState, useEffect, useContext } from "react";
import { Context } from "../store/context";
import { Navigate } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function CreateEvent() {
  const { store, actions } = useContext(Context);
  const [eventoCreado, setEventoCreado] = useState(false);
  const navigate = useNavigate();

  function submitHandler(e) {
    actions.createEvent(e, navigate, setEventoCreado);
  }
  function newInvite(e) {
    const targetUser = e.target[1].value;
    actions.createNewInvite(targetUser);
  }

  useEffect(() => {
    actions.emptyInviteesDetails();
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/auth", {
      method: "GET",
      headers: {
        Authorization: "Token " + localStorage.getItem("reuPlanToken"),
      },
    })
      .then((resp) => {
        if (resp.status == 401 || resp.status == 422) {
          localStorage.removeItem("reuPlanUser");
          localStorage.removeItem("reuPlanUserID");
          localStorage.removeItem("reuPlanCurrentEvent");
          localStorage.removeItem("reuPlanToken");
          navigate("/login");

          toast.error('Inicia sesión para continuar');
          store.loggedIn = false;
        }
        if (resp.status == 200) {
          store.loggedIn = true;
        }
      })
      .then((data) => {})
      .catch((error) => {});
    return () => {
      actions.emptyInviteesDetails();
    };
  }, [store.loggedIn, store.yaInvitado]);

  if (!store.loggedIn) {
    return <Navigate to="/login" />;
  } else {
    return (
      <div className="container py-4">
        <h4 className="fw-semibold text-body-tertiary">
          Primera parte: Detalles del Evento
        </h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitHandler(e);
          }}
        >
          <fieldset disabled={eventoCreado}>
            <div className="d-flex align-items-center w-100">
              <label className="fs-2 fw-semibold w-75" htmlFor="eventName">
                Nombre del evento*
                <input
                  name="eventName"
                  type="text"
                  className="form-control my-1 fs-4"
                  placeholder="nombre de tu evento"
                  required
                />
              </label>
            </div>
            <div className="mt-3 mb-5">
              <div className="row w-75 align-items-start justify-content-start">
                <div className="col-sm d-flex align-items-center me-4">
                  <h3 className="w-75 me-2 fw-semibold">Desde el día*:</h3>
                  <input
                    type="date"
                    className="flex-shrink form-control"
                    required
                  ></input>
                </div>
                <div className="col-sm d-flex align-items-center">
                  <h3 className="w-75 fw-semibold me-2">Hasta el día*:</h3>
                  <input
                    type="date"
                    className="flex-shrink-1 flex-fill form-control"
                    required
                  ></input>
                </div>
              </div>
              <p className="text-secondary fw-semibold">
                Estos son los días en que los invitados podrán ingresar los
                horarios en que podrían asistir a tu evento
              </p>
            </div>
            <div className="row d-flex align-items-center my-2">
              <div className="col-sm d-flex align-items-center me-4">
                <h4 className="fw-semibold me-2">Duración:</h4>
                <input className="form-control w-50" type="number" disabled></input>
              </div>
              <div className="col-sm d-flex align-items-center my-2">
                <h4 className="me-2 fw-semibold">Lugar:</h4>
                <input
                  type="text"
                  className="form-control"
                  placeholder="lugar(presencial) / app(online)"
                ></input>
              </div>
              <div className="col-sm d-flex flex-column my-2">
                <div className="d-flex">
                  <label className="fw-semibold fs-5 " htmlFor="formMapQuery">
                    Buscar y mostrar ubicación en un mapa{" "}
                    <input
                      type="checkbox"
                      className="form-check-input mx-2"
                      defaultChecked
                      id="formMapQuery"
                    ></input>
                  </label>
                </div>
                <small className="text-secondary fs-6 fw-semibold">
                  Para mayor precisión escribe una dirección, nombre de edificio
                  o institución junto a ciudad o código postal.
                </small>
              </div>
            </div>
            <h4 className="fw-semibold"> Descripción</h4>
            <textarea className="form-control w-75"></textarea>
            <div className="my-4 row">
              <div className="col-md d-flex flex-column">
                <h3 className="fw-semibold">Privacidad</h3>
                <h4 className="fw-semibold">Usuarios Pueden:</h4>
                <div className="form-check py-2  ">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkCantidadInvitados"
                  />
                  <label
                    htmlFor="checkCantidadInvitados"
                    className="form-check-label fs-5 fw-semibold"
                  >
                    Ver cuántos invitados hay
                  </label>
                </div>
                <div className="form-check ms-5 py-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkInvitadosID"
                  />
                  <label
                    htmlFor="checkInvitadosID"
                    className="form-check-label fs-5 fw-semibold"
                  >
                    Ver a otros invitados
                  </label>
                </div>
                <div className="form-check ms-5 py-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkRespuestasInvitados"
                  />
                  <label
                    htmlFor="checkRespuestasInvitados"
                    className="form-check-label fs-5 fw-semibold"
                  >
                    Ver quienes han respondido
                  </label>
                </div>
                <div className="form-check py-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkInvitadosImprescindibles"
                  />
                  <label
                    htmlFor="checkInvitadosImprescindibles"
                    className="form-check-label fs-5 fw-semibold"
                  >
                    Saber si hay, o no, invitados imprescindibles
                  </label>
                </div>
              </div>
              <div className="col-md d-none flex-column fw-semibold">
                <h3 className="fw-semibold">Requisitos de aceptación:</h3>
                <h4 className="fw-semibold">Asistentes deben tener:</h4>
                <div className="d-flex flex-column">
                  <div className="col-6 form-check py-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="checkEmail"
                    />
                    <label
                      htmlFor="checkEmail"
                      className="form-check-label fs-5 fw-semibold"
                    >
                      Email verificado
                    </label>
                  </div>
                  <div className="col-6 form-check py-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="checkNombre"
                    />
                    <label
                      htmlFor="checkNombre"
                      className="form-check-label fs-5 fw-semibold"
                    >
                      Nombre
                    </label>
                  </div>
                  <div className="col-6 form-check py-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="checkTelefono"
                    />
                    <label
                      htmlFor="checkTelefono"
                      className="form-check-label fs-5 fw-semibold"
                    >
                      Número de teléfono
                    </label>
                  </div>
                  <div className="col-6 form-check py-2">
                    <input
                      className="form-check-input fw-semibold"
                      type="checkbox"
                      id="checkDireccion"
                    />
                    <label
                      htmlFor="checkDireccion"
                      className="form-check-label fs-5 fw-semibold"
                    >
                      Dirección
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
          <div className="d-flex justify-content-center align-items-center flex-column">
            <label className="fw-semibold">
              *Necesario para creación de evento
            </label>
            {eventoCreado == false && (
              <button
                type="submit"
                className="btn w-75 btn-primary fw-semibold py-2 fs-5"
              >
                Crear evento
              </button>
            )}
            {eventoCreado == true && (
              <button
                disabled
                className="btn w-75 btn-primary fw-semibold py-2 fs-5"
              >
                Evento creado
              </button>
            )}
          </div>
          <p className="fw-semibold text-secondary py-3">
            Los invitados se agregan una vez creado el evento
          </p>
        </form>
        <div id="invitadosList"></div>

        {/* ---------------------Sección de creación de invitados------------ */}

        {eventoCreado == true && (
          <div>
            <hr />
            <h4 className="fw-semibold text-body-tertiary">
              Segunda parte: Enviar invitaciones:
            </h4>
            <div className="d-flex flex-column my-5">
              <div className="d-flex mb-4 align-items-center">
                <h2 className="fw-semibold">Invitados</h2>
                <button
                  type="button"
                  className="btn btn-primary px-3 py-2 ms-4 fw-semibold fs-5 align-self-center"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Agregar invitado
                </button>
              </div>

              <h5 className="fw-semibold">
                Los contactos recibirán una invitación para incorporar sus
                propios bloques de disponibilidad en el calendario de
                asistencia, el cual, de forma automática, calculará los bloques
                en que todos los invitados participantes tienen la posibilidad
                de asistir.
                <br />
                <br />
                Los invitados agregados pueden ser indicados como
                imprescindible.
                <br />
                En caso de que un invitado indispensable rechace la invitación
                el evento será marcado como inviable.
                <br />
                <br />
                Los usuarios se muestran como "Nombre (Nombre de usuario)"
                <br />
                <span className="text-primary">
                  Eres organizador y asistente? No olvides incluirte en la lista
                  de invitados también!
                </span>
                <br />
              </h5>
              <div className="py-4">
                <ul className="w-75 my-2 list-group list-group-flush">
                  {store.fetchedEvent.invitaciones && store.fetchedEvent.invitaciones.length > 0 &&
                    store.fetchedEvent.invitaciones.map((invitacion) => {
                      return (
                        <li
                          className="list-group-item fs-4 fw-semibold my-3"
                          key={"user_" + invitacion.id}
                        >
                          <div className="row d-flex align-items-center">
                            <h5 className="col-sm-6 fw-semibold">
                              {invitacion.invitado.name}{" "}
                              <span className="fw-medium">
                                ({invitacion.invitado.username})
                              </span>
                            </h5>
                            <div className="form-check col-sm-5">
                              {invitacion.imprescindible == false ? (
                                <button
                                  onClick={() =>
                                    actions.toggleImprescindible(
                                      invitacion.id
                                    )
                                  }
                                  htmlFor="checkImprescindible"
                                  className="btn btn-primary fs-5 fw-semibold"
                                >
                                  Hacer imprescindible
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    actions.toggleImprescindible(
                                      invitacion.id
                                    )
                                  }
                                  htmlFor="checkImprescindible"
                                  className="btn btn-secondary fs-6 fw-semibold"
                                >
                                  Hacer prescindible
                                </button>
                              )}
                            </div>
                            <button
                              className="col-sm-1 btn text-danger fw-bold fs-4"
                              onClick={() => {
                                actions.uninviteUser(invitacion.id);
                              }}
                            >
                              X
                            </button>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
            <div>
              <div className="d-flex justify-content-center">
                <Link
                  onClick={()=>store.eventReady}
                  to={"/event/" + localStorage.getItem("reuPlanCurrentEvent")}
                  className="btn btn-success fs-5 fw-semibold w-50 py-3 rounded"
                >
                  Finalizar creación de evento
                </Link>
              </div>
              <p className="fw-semibold py-3">
                Los detalles e invitados del evento se pueden editar
                posteriormente entrando al evento en "Mis reuniones"
              </p>
            </div>
          </div>
        )}
        {/*-------------- MODAL DE ENVIAR INVITADOS ----------------*/}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="invitationModal"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title fs-4 fw-semibold"
                  id="invitationModal"
                >
                  Agregar invitado
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  newInvite(e);
                }}
              >
                <fieldset>
                  <div className="modal-body">
                    <h5 className="fw-semibold">
                      Ingresa el nombre de usuario o e-mail del invitado
                    </h5>
                    <input
                      type="text"
                      className="input form-control my-3"
                      placeholder="e-mail o nombre de usuario"
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary rounded-0 fw-semibold"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary fw-semibold"
                    >
                      Enviar invitación
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CreateEvent;
