import { useContext, useEffect, useState } from "react";
import { Context } from "../store/context";
import { Grid } from "@mui/material";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";

export default function UserEvents() {
  const backendURL = import.meta.env.DEV
    ? import.meta.env.VITE_APP_BACKEND_URL
    : "";
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getSession()
    fetch(backendURL + "api/event/user", {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: "Token " + localStorage.getItem("reuPlanToken"),
      },
    })
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        }
      })
      .then((data) => {
        if (data.events) {
          store.ownEvents = data.events;
        }
      });
  }, []);

  return store.ownEvents && store.loggedIn ? (
    <div className="container">
      <Link className="btn btn-primary px-6 fw-semibold fs-5" to="/dashboard">Volver</Link>
      <Link className="btn btn-success px-6 fw-normal fs-5 ms-3" to="/create">Nuevo Evento</Link>
      <h2 className="fw-semibold mb-2">Eventos creados por ti:</h2>
      <Grid container spacing={2}>
        {store.ownEvents.map((event) => {return <EventCard event={event} key={"key+"+event.id}/>})}
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
