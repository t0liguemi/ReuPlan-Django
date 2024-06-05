import { useContext, useEffect, useState } from "react";
import { Context } from "../store/context";
import { Grid } from "@mui/material";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";

export default function acceptedEvents() {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getSession()
  }, []);

  return store.loggedIn && store.acceptedEvents ? (
    <div className="container">
        <Link className="btn btn-primary px-6 fw-semibold fs-5" to="/dashboard">Volver</Link>
      <h2 className="fw-semibold mb-0">Eventos aceptados:</h2>
      <p className='fs-6 fw-light mb-2'>Puedes modificar aún tus horarios de asistencia o incluso rechazar la invitación.</p>
      <Grid container spacing={2}>
        {store.acceptedEvents.map((event) => {
          return <EventCard event={event} key={"key+" + event.id} />;
        })}
      </Grid>
    </div>
  ) : (
    <>
      <div className="d-flex justify-content-center align-content-center my-5 py-5">
        <div className="spinner-border" role="status"></div>
      </div>
    </>
  );
}
