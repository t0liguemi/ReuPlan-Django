import Calendar from "../components/Calendario";
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/context";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Tooltip from "@mui/material/Tooltip";

const Evento = (props) => {
  const apiKey = import.meta.env.VITE_APP_API_KEY;
  const navigate = useNavigate();
  const { eventID } = useParams();
  const { store, actions } = useContext(Context);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState();
  const [userBlocks, setUserBlocks] = useState();
  const currentUser = localStorage.getItem("reuPlanUserID");
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Chile/Continental",
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    localStorage.setItem("reuPlanCurrentEvent", eventID);
    fetch("http://localhost:8000/api/auth", {
      method: "GET",
      headers: {
        Authorization: "Token " + localStorage.getItem("reuPlanToken"),
      },
    })
      .then((resp) => {
        if (resp.status >= 400 && resp.status < 500) {
          toast.error("Inicia sesión para continuar");
          store.loggedIn = false;
          navigate("/login");
        } else if (resp.status == 200) {
          actions.mainEventView(eventID, navigate);
          store.loggedIn = true;
        }
      })
      .then((data) => {})
      .catch((error) => {});

    return () => {
      store.eventReady = false;
    };
  }, []);

  if (store.loggedIn === false || store.eventReady === false) {
    return (
      <div className="d-flex justify-content-center align-content-center my-5 py-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  } else if (store.eventReady == true) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-between">
          <h1 className="fw-semibold">Evento: {store.evento.nombre}</h1>
          <div className="d-grid gap-2 d-sm-block align-self-center">
            <Link
              className="btn btn-success fw-semibold px-4 py-2 fs-5 mx-3"
              to="#editarAsistencia"
              onClick={() =>
                toast(
                  "Agrega un bloque para aceptar este evento o modificar tu asistencia"
                )
              }
            >
              {store.bloquesUsuarioActual.length > 0
                ? "Modificar Asistencia"
                : store.evento.organizador == currentUser
                ? "Participar"
                : "Aceptar"}
            </Link>
            {currentUser == store.evento.organizador ? (
              <Link
                onClick={() => (store.eventReady = false)}
                to={`/event/${eventID}/edit`}
                className="btn btn-primary fw-semibold px-4 py-2 fs-5 mx-3"
              >
                Editar
              </Link>
            ) : store.fetchedEvent.rechazos.some(
                (rej) =>
                  String(rej.invitado) ===
                  String(localStorage.getItem("reuPlanUserID"))
              ) === true ? (
              <button className="btn btn-danger fw-semibold px-4 py-2 fs-5 mx-3">
                Rechazado
              </button>
            ) : (
              <button
                onClick={(e) => {
                  actions.rejectInvite(navigate);
                }}
                className="btn btn-danger fw-semibold px-4 py-2 fs-5 mx-3"
              >
                Rechazar
              </button>
            )}
          </div>
        </div>
        {store.fetchedEvent.rechazos.some(
          (rej) => String(rej.invitado) === String(currentUser)
        ) == true ? (
          <h4 className="text-danger px-0 mx-0 fw-semibold">
            Rechazaste este evento
          </h4>
        ) : (
          <></>
        )}
        {store.currentEventViability ? (
          <></>
        ) : (
          <h4 className="text-danger px-0 mx-0 fw-semibold">
            Este evento es inviable
          </h4>
        )}
        <div className="py-4">
          <div className="row">
            <h3 className="mt-4 fw-semibold">
              Evento creado por{" "}
              {store.hostData != undefined && store.hostData.name} (
              {store.hostData != undefined && store.hostData.username})
            </h3>
            <h3 className="fw-semibold">
              Desde el{" "}
              {store.evento.inicio.toLocaleDateString("es", dateOptions)} hasta
              el {store.evento.final.toLocaleDateString("es", dateOptions)}
            </h3>
            {/* <h3 className="fw-semibold">
              Duración: {store.evento.duracion} horas.
            </h3> */}
            {store.evento.lugar && (
              <h3 className="fw-semibold text-break">
                Lugar: {store.evento.lugar}
              </h3>
            )}
            {store.evento.privacidad[0] == true ? (
              <h3 className="fw-semibold">
                {store.fetchedEvent.invitaciones.length} invitaciones,{" "}
                {store.evento.respondidos.length} aceptada
                {store.evento.respondidos.length != 1 ? "s" : ""},{" "}
                {store.fetchedEvent.rechazos.length} rechazada
                {store.fetchedEvent.rechazos.length != 1 ? "s" : ""}.
              </h3>
            ) : (
              <></>
            )}
            <div className="row">
              <div className="col-sm-6">
                {store.evento.privacidad[1] == true ? (
                  <div>
                    <h3 className="mt-4 fw-semibold">Invitados:</h3>
                    <ul className="list-group w-75 mx-0 px-0 ">
                      {store.fetchedEvent.invitaciones.map((invitacion, i) => {
                        return (
                          <div key={"invitee" + i}>
                            <Tooltip
                              placement="right"
                              title={
                                <React.Fragment>
                                  <span className="fs-6 fw-normal">
                                    {invitacion.invitado.name ? (
                                      <>
                                        {invitacion.invitado.username}
                                        <br />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {invitacion.invitado.email}
                                  </span>
                                </React.Fragment>
                              }
                            >
                              <li
                                className={
                                  store.fetchedEvent.respuestas.some(
                                    (resp) =>
                                      resp.invitado == invitacion.invitado.id
                                  )
                                    ? "text-success list-group-item list-group-item-action fs-5"
                                    : store.fetchedEvent.rechazos.some(
                                        (rechazo) =>
                                          rechazo.invitado ==
                                          invitacion.invitado.id
                                      )
                                    ? "text-danger list-group-item list-group-item-action fs-5"
                                    : "list-group-item list-group-item-action fs-5"
                                }
                              >
                                {invitacion.invitado.name
                                  ? invitacion.invitado.name
                                  : invitacion.invitado.username}
                                {store.evento.privacidad[3] ? (
                                  invitacion.imprescindible ? (
                                    <span className="fw-light text-dark text-opacity-50 float-end">
                                      Imprescindible
                                    </span>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </li>
                            </Tooltip>
                          </div>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <></>
                )}
                <p className="mt-4 fs-4 fw-semibold">
                  {store.evento.descripcion}
                </p>
              </div>
              {store.evento.lugar &&
              store.fetchedEvent.event.mapsQuery === true ? (
                <iframe
                  className="col-sm-6 my-4 px-4"
                  width="400"
                  height="450"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/search?q=${store.evento.lugar.replace(
                    " ",
                    "+"
                  )}&key=${apiKey}`}
                ></iframe>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <h2 className="fw-semibold">Resultados de encuesta</h2>
        <Calendar />
        <div className="mb-4">
          <h3>
            {store.fetchedEvent.respuestas.length > 0 ? (
              store.fechasPosiblesSeparadas.length > 0 ? (
                <span className="fw-semibold">
                  Bloques aprobados de acuerdo a{" "}
                  {store.evento.respondidos.length} usuario
                  {store.evento.respondidos.length > 1 ? "s:" : ":"}
                </span>
              ) : (
                <span className="fw-semibold">
                  No hay bloques posibles con las respuestas ingresadas (
                  {store.evento.respondidos.length} usuario
                  {store.evento.respondidos.length != 1 ? "s" : ""})
                </span>
              )
            ) : (
              <span className="fw-semibold">No hay respuestas aún</span>
            )}
          </h3>
          {store.fechasPosiblesSeparadas != [] &&
            store.fechasPosiblesSeparadas.map((horario, i) => {
              return (
                <h5 className="fw-semibold" key={"horario" + i}>
                  {horario[0]
                    .toLocaleDateString("es", dateOptions)
                    .charAt(0)
                    .toUpperCase() +
                    horario[0].toLocaleDateString("es", dateOptions).slice(1)}
                  : Desde las {horario[1][0]}:00 hasta las {horario[1][1]}:00.
                </h5>
              );
            })}
        </div>
        <hr />
        <div className="my-4" id="editarAsistencia">
          {store.inviteesDetails.some((invitee) => invitee.id == currentUser) ==
          false ? (
            <div>
              <h4 className="mb-4 fw-semibold">
                Eres organizador de este evento, pero no participante aún.
              </h4>
              <button
                className="btn btn-primary px-4 fw-semibold"
                onClick={() =>
                  actions.createNewInvite(localStorage.getItem("reuPlanUser"))
                }
              >
                Participar del evento
              </button>
            </div>
          ) : (
            <form>
              <h2 className="mb-4 fw-semibold">Tu Respuesta:</h2>
              <div className="my-4">
                <h4 className="fw-semibold">
                  Agregar bloques de disponibilidad:
                </h4>
                <div className="row my-3">
                  <div className="col-sm-4 d-flex my-2">
                    <h5 className="fw-semibold w-25 align-self-center">
                      El día
                    </h5>
                    {store.evento.inicio.toISOString().slice(0, 10) ==
                    store.evento.final.toISOString().slice(0, 10) ? (
                      <input
                        name="fechaNuevoBloque"
                        type="date"
                        className="form-control fw-semibold"
                        value={store.evento.inicio.toISOString().slice(0, 10)}
                        readOnly
                      ></input>
                    ) : (
                      <input
                        name="fechaNuevoBloque"
                        type="date"
                        className="form-control fw-semibold"
                        defaultValue={store.evento.inicio
                          .toISOString()
                          .slice(0, 10)}
                        min={store.evento.inicio.toISOString().slice(0, 10)}
                        max={store.evento.final.toISOString().slice(0, 10)}
                      ></input>
                    )}
                  </div>
                  <div className="d-flex col-sm-3 my-2">
                    <h5 className="align-self-center fw-semibold me-2">
                      desde las
                    </h5>
                    <select
                      name="horaInicioNuevoBloque"
                      className="form-select form-select-sm col fw-semibold"
                    >
                      <option value="0">0:00</option>
                      <option value="1">1:00</option>
                      <option value="2">2:00</option>
                      <option value="3">3:00</option>
                      <option value="4">4:00</option>
                      <option value="5">5:00</option>
                      <option value="6">6:00</option>
                      <option value="7">7:00</option>
                      <option value="8">8:00</option>
                      <option value="9">9:00</option>
                      <option value="10">10:00</option>
                      <option value="11">11:00</option>
                      <option value="12">12:00</option>
                      <option value="13">13:00</option>
                      <option value="14">14:00</option>
                      <option value="15">15:00</option>
                      <option value="16">16:00</option>
                      <option value="17">17:00</option>
                      <option value="18">18:00</option>
                      <option value="19">19:00</option>
                      <option value="20">20:00</option>
                      <option value="21">21:00</option>
                      <option value="22">22:00</option>
                      <option value="23">23:00</option>
                    </select>
                  </div>
                  <div className="col-sm-3 d-flex my-2">
                    <h5 className="col fw-semibold me-2">hasta las</h5>
                    <select
                      name="horaFinalNuevoBloque"
                      className="form-select form-select-sm col fw-semibold"
                    >
                      <option value="1">1:00</option>
                      <option value="2">2:00</option>
                      <option value="3">3:00</option>
                      <option value="4">4:00</option>
                      <option value="5">5:00</option>
                      <option value="6">6:00</option>
                      <option value="7">7:00</option>
                      <option value="8">8:00</option>
                      <option value="9">9:00</option>
                      <option value="10">10:00</option>
                      <option value="11">11:00</option>
                      <option value="12">12:00</option>
                      <option value="13">13:00</option>
                      <option value="14">14:00</option>
                      <option value="15">15:00</option>
                      <option value="16">16:00</option>
                      <option value="17">17:00</option>
                      <option value="18">18:00</option>
                      <option value="19">19:00</option>
                      <option value="20">20:00</option>
                      <option value="21">21:00</option>
                      <option value="22">22:00</option>
                      <option value="23">23:00</option>
                      <option value="24">24:00</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <button
                  className="btn btn-primary fw-semibold"
                  onClick={(event) => {
                    event.preventDefault();
                    actions.addNewAvailability(event, navigate);
                  }}
                >
                  Agregar Bloque
                </button>
              </div>
            </form>
          )}
          <div className="my-3">
            {store.bloquesUsuarioActual.length > 0 ? (
              <h4 className="fw-semibold">Tus bloques:</h4>
            ) : (
              <></>
            )}
            {store.bloquesUsuarioActual != [] &&
              store.bloquesUsuarioActual.map((horario, i) => {
                return (
                  <div
                    className="row align-items-baseline"
                    key={"disponibilidad" + i}
                  >
                    <h5 className="fw-semibold col-5">
                      {horario[0]
                        .toLocaleDateString("es", dateOptions)
                        .charAt(0)
                        .toUpperCase() +
                        horario[0]
                          .toLocaleDateString("es", dateOptions)
                          .slice(1)}
                      : {horario[1][0] / 100}:00 - {horario[1][1] / 100}:00
                    </h5>

                    <button
                      className="btn col-1 fs-5 fw-bold text-danger"
                      onClick={() => {
                        actions.deleteAvailability(horario[2], navigate);
                      }}
                    >
                      X
                    </button>
                    <div className="col-5"></div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
};

export default Evento;
