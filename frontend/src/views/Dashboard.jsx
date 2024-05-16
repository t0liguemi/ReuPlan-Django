import { Box, Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/context";

export default function Dashboard() {
  const backendURL = import.meta.env.DEV
    ? import.meta.env.VITE_APP_BACKEND_URL
    : "";

  const { store, actions } = useContext(Context);
  const [loadedEvents,setLoadedEvents] = useState(false)
  console.log(store);

  useEffect(() => {
    fetch(
      backendURL + "api/event/user/" + localStorage.getItem("reuPlanUserID"),
      {
        method: "GET",
        headers: {
          Authorization: "Token " + localStorage.getItem("reuPlanToken"),
        },
      }
    ).then((res) => {
      if (res.status == 200) {
        return res.json();
      }
    })
    .then((data)=>{if (data.events){
      store.ownEvents = data.events;
      setLoadedEvents(true)
    }});
  }, []);

  return (loadedEvents? <div className="container py-4">
      <h2 className="fw-semibold">Mis Eventos</h2>
      <Grid container spacing={2} justifyContent="center">
        {store.ownEvents.length>0 &&
        <Grid item xs={12} sm={6}>
          <Link to="/events/own" style={{ textDecoration: "none" }}>
            <Box
              padding={3}
              height={180}
              sx={{
                borderRadius: 1,
                bgcolor: "#f0a202",
                "&:hover": {
                  bgcolor: "#C98800",
                },
              }}
            >
              <h3 className="text-light">Propios</h3>
              <small className="text-light">
                Eventos creados por ti, sin importar si eres participante.
              </small>
              <p className="fs-6 fw-semibold text-white">Tienes {store.ownEvents.length} evento{store.ownEvents.length>1?"s":""} activos</p>
            </Box>
          </Link>
        </Grid>}

        {store.pending > 0 ? (
          <Grid item xs={12} sm={6}>
            <Link style={{ textDecoration: "none" }}>
              <Box
                padding={3}
                height={180}
                sx={{
                  borderRadius: 1,
                  bgcolor: "#f18805",
                  "&:hover": {
                    bgcolor: "#D07400",
                  },
                }}
              >
                <h3 className="text-light">Pendientes</h3>
                <small className="text-light">
                  Eventos, para los que recibiste una invitación, a los que aún
                  no has ingresado una respuesta
                </small>
                <p className="fs-6 fw-semibold text-white py-1">
                  Tienes {store.pending} evento{store.pending > 1 ? "s" : ""}{" "}
                  sin responder.
                </p>
              </Box>
            </Link>
          </Grid>
        ) : (
          <></>
        )}

        <Grid item xs={12} sm={6}>
          <Link style={{ textDecoration: "none" }}>
            <Box
              padding={3}
              height={180}
              sx={{
                borderRadius: 1,
                bgcolor: "#7b9e89",
                "&:hover": {
                  bgcolor: "#668974",
                },
              }}
            >
              <h3 className="text-light">Aceptados</h3>
              <small className="text-light">
                Eventos a los que ingresaste horarios de asistencia
              </small>
            </Box>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Link style={{ textDecoration: "none" }}>
            <Box
              padding={3}
              height={180}
              sx={{
                borderRadius: 1,
                bgcolor: "#d95d39",
                "&:hover": {
                  bgcolor: "#B34E30",
                },
              }}
            >
              <h3 className="text-light">Rechazados</h3>
              <small className="text-light">
                Eventos a los cuales no asistirás
              </small>
            </Box>
          </Link>
        </Grid>
      </Grid>
    </div>:<>Loading</>
)}
