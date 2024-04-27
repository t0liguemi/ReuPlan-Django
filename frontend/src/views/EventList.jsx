import "./EventList.css";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/context";
import toast from "react-hot-toast";
const backendURL =  import.meta.env.VITE_APP_MODE === "development" ? import.meta.env.VITE_APP_BACKEND_URL : ""


const EventList = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [eventosAceptados, setEventosAceptados] = useState([]);
  const [eventosRechazados, setEventosRechazados] = useState([]);
  const [eventosPendientesFiltrados, setEventosPendientesFiltrados] = useState(
    []
  );
  const [eventosOrganizadosPorMi, setEventosOrganizadosPorMi] = useState([]);

  const fetchData = async () => {
    try {
      const [eventsResponse, participationResponse] = await Promise.all([
        fetch(backendURL+"api/event/all", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: "Token " + localStorage.getItem("reuPlanToken"),
          },
        }),
        fetch(backendURL+"api/user/" +
            localStorage.getItem("reuPlanUserID") +
            "/participation",
          {
            headers: {
              "Content-type": "application/json",
              Authorization: "Token " + localStorage.getItem("reuPlanToken"),
            },
          }
        ),
      ]);

      if (eventsResponse.ok && participationResponse.ok) {
        const [eventsData, participationData] = await Promise.all([
          eventsResponse.json(),
          participationResponse.json(),
        ]);

        setEventos(eventsData);
        const {
          emitted_rejections,
          responses,
          eventDetails,
        } = participationData;

        const eventosAceptadosActualizados = eventos.filter((evento) =>
          responses.some(
            (respuesta) => String(respuesta.evento) === String(evento.id)
          )
        );

        const eventosRechazadosActualizados = eventos.filter((evento) =>
          emitted_rejections.some(
            (rechazo) => String(rechazo.evento) === String(evento.id)
          )
        );
        const eventosOrganizadosPorMi = eventos.filter(
          (evento) =>
            String(evento.organizador) ===
            String(localStorage.getItem("reuPlanUserID"))
        );
        setEventosOrganizadosPorMi(eventosOrganizadosPorMi);
        setEventosAceptados(eventosAceptadosActualizados);
        setEventosRechazados(eventosRechazadosActualizados);
        const eventosInvitados = eventDetails.filter(
          (inv) =>
            !responses.some((resp) => resp.evento == inv.id) &&
            !emitted_rejections.some((rej) => rej.evento == inv.id)
        );
        setEventosPendientesFiltrados(eventosInvitados);
        if (loaded == false) {
          setLoaded(true);
        }
      } else {
      }
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
    }
  };

  useEffect(() => {
    fetch(backendURL+"api/auth", {
      headers: {
        Authorization: "Token " + localStorage.getItem("reuPlanToken"),
      },
    })
      .then((resp) => {
        if (resp.status >= 400 && resp.status <= 599) {
          toast.error("Inicia sesión para continuar");
          store.loggedIn = false;
          navigate("/login");
        } else if (resp.status == 200) {
          fetchData();
          if (
            store.fetchedEvent.invitaciones.some(
              (inv) => inv.invitado.id == currentUser
            ) == false &&
            store.fetchedEvent.organizador.id != currentUser
          ) {
            toast.error("No tienes acceso a ese evento");
            navigate("/eventList");
          }
        }
      })
      .then((data) => {})
      .catch((error) => {});
  }, [store.currentUser, localStorage.getItem("reuPlanUserID"), loaded]);
  if (loaded) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-between">
          <h1 className="events-title fw-semibold">Mis Reuniones</h1>
          <Link style={{ zIndex: "3" }} to="/create">
            <button className="px-4 btn btn-success fs-5 py-2 fw-semibold">
              Nuevo Evento
            </button>
          </Link>
        </div>

        <div
          className="sticky-top"
          style={{ paddingTop: "38px", marginTop: "-38px", zIndex: "2" }}
        >
          <div className="row my-4 bg-primary py-2">
            <div className="col-4">
              <h5 className="fw-semibold text-white text-center">
                Nombre del evento
              </h5>
            </div>
            <div className="col-4">
              <h5 className="text-center fw-semibold text-white">Fecha</h5>
            </div>
            <div className="col-4">
              <h5 className="fw-semibold text-white text-center">Lugar</h5>
            </div>
          </div>
        </div>

        {/* Sección de eventos organizados por el usuario */}
        <div className="fw-semibold">
          <div className="mb-3">
            <h3 className="pt-4 fw-semibold">Organizados por mí:</h3>
            <small className="text-secondary fw-semibold py-0 my-0">
              Eventos que tu creaste en la aplicación.
            </small>
          </div>
          {eventosOrganizadosPorMi.length===0?<h5>No hay eventos creados por tí.</h5>:<></>}
          {eventosOrganizadosPorMi.map((evento) => (
            <Link
              to={`/event/${evento.id}`}
              style={{ textDecoration: "none" }}
              key={"org" + evento.id}
              className="evento-lista row my-4 mx-0 text-break"
            >
              <h5 className="col-4 fw-semibold fs-5 text-center">
                {evento.name}
              </h5>
              <p className="col-4 m-0 fw-semibold fs-6 text-center">{`${evento.inicio}  al  ${evento.final}`}</p>
              <p className="col-4 p-0 m-0 fw-semibold fs-6  text-center">
                {evento.lugar}
              </p>
            </Link>
          ))}
        </div>

        {/* Sección de eventos pendientes */}
        <div className="fw-semibold">
          <div className="mb-3">
            <h3 className="pt-4 mb-0 pb-0 fw-semibold">Pendientes</h3>
            <small className="text-secondary fw-semibold py-0 my-0">
              Eventos, a los que has sido invitado, en los que aún no has
              ingresado una respuesta.
            </small>
          </div>
          {eventosPendientesFiltrados.map((evento) => (
            <Link
              to={`/event/${evento.id}`}
              style={{ textDecoration: "none" }}
              key={"pending" + evento.id}
              className="evento-lista row my-4 mx-0 text-break"
            >
              <h5 className="col-4 fw-semibold fs-5 text-center">
                {evento.name}
              </h5>
              <p className="col-4 m-0 fw-semibold fs-6 text-center">{`${evento.inicio} al ${evento.final}`}</p>
              <p className="col-4 p-0 m-0 tex-center fw-semibold fs-6 text-center">
                {evento.lugar}
              </p>
            </Link>
          ))}
        </div>

        {/* Sección de eventos aceptados */}
        <div className="fw-semibold">
          <div className="mb-3">
            <h3 className="pt-4 mb-0 pb-0 fw-semibold">Aceptados</h3>
            <small className="text-secondary fw-semibold py-0 my-0">
              Eventos, a los que has sido invitado, a los que has ingresado
              disponibilidades.
            </small>
          </div>
          {eventosAceptados.map((evento) => (
            <Link
              to={`/event/${evento.id}`}
              style={{ textDecoration: "none" }}
              key={"accept" + evento.id}
              className="evento-lista row my-4 text-body text-break"
            >
              <h5 className="col-4 fw-semibold fs-5 text-center">
                {evento.name}
              </h5>
              <p className="col-4 m-0 fw-semibold fs-6 text-center">{`${evento.inicio} al ${evento.final}`}</p>
              <p className="col-4 p-0 m-0 tex-center fw-semibold fs-6 text-center">
                {evento.lugar}
              </p>
            </Link>
          ))}
        </div>
        {/* Sección de eventos rechazados */}
        <div className="fw-semibold">
          <div className="mb-3">
            <h3 className="pt-4 mb-0 pb-0 fw-semibold">Rechazados</h3>
            <small className="text-secondary fw-semibold py-0 my-0">
              Eventos, para los cuales recibiste una invitación, que has
              rechazado.
            </small>
          </div>
          {eventosRechazados.map((evento) => (
            <Link
              key={"rej" + evento.id}
              to={`/event/${evento.id}`}
              style={{ textDecoration: "none" }}
              className="evento-lista text-body row my-4"
            >
              <h5 className="col-4 fw-semibold fs-5 text-center">
                {evento.name}
              </h5>
              <p className="col-4 m-0 fw-semibold fs-6 text-center">{`${evento.inicio} al ${evento.final}`}</p>
              <p className="col-4 p-0 m-0 tex-center fw-semibold fs-6 text-center">
                {evento.lugar}
              </p>
            </Link>
          ))}
        </div>
      </div>
    );
  } else {
    <div className="d-flex justify-content-center align-content-center my-5 py-5">
      <div className="spinner-border" role="status"></div>
      <h5 className="text-secondary">Cargando</h5>
    </div>;
  }
};
export default EventList;
