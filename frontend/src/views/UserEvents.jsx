import { useContext, useEffect, useState } from "react";
import { Context } from "../store/context";

export default function UserEvents() {
  const backendURL = import.meta.env.DEV
    ? import.meta.env.VITE_APP_BACKEND_URL
    : "";
  const { store, actions } = useContext(Context);

  useEffect(() => {
    fetch(
      backendURL + "api/event/user/" + localStorage.getItem("reuPlanUserID"),
      {
        method: "GET",
        headers: {
          Authorization: "Token " + localStorage.getItem("reuPlanToken"),
        },
      }
    )
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

  return store.ownEvents ? (
    <div className="container">
      <h2 className="fw-semibold mb-2">Eventos creados por ti:</h2>
      {store.ownEvents.map((event) => (
        <button className="btn border bg-none"><h6>{event.name}</h6></button>
      ))}
    </div>
  ) : (
    <>
      <h2>loading</h2>
    </>
  );
}
