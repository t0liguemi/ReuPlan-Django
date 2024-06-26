import { useContext, useEffect, useState } from "react";
import CalendarSVG from "../resources/Calendarios.svg?react";
import { Link } from "react-router-dom";
import { Context } from "../store/context";
import { Grid } from "@mui/material";

function Bienvenida() {
  const { store, actions } = useContext(Context);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  function handleResize() {
    setInnerWidth(window.innerWidth);
  }

  useEffect(() => {window.addEventListener("resize", handleResize);},[])

  return (
    <div className="container">
      <div className="row">
        <div className="row mx-auto">
          <div className={innerWidth > 800 ? "col-6" : "col-12"}>
            <span className="fs-2 fw-bold ">Bienvenidx a </span>
            <span className="text-primary fs-2 fw-bold ">Reu</span>
            <span className="text-success fs-2 fw-bold ">plan</span>
            <span className=" fs-2 fw-bold ">
              , una aplicación web minimalista con un único propósito: Facilitar
              los encuentros.
            </span>
            <p className="mt-4 fs-5 fw-semibold">
              Con Reuplan puedes organizar tus reuniones en tiempo récord, sin
              tener que ocuparte personalmente de la disponibilidad de tus
              invitados. Solamente indica en qué periodo debe ocurrir tu evento
              y tus invitados agregarán sus disponibilidades.
            </p>
            <p className="fs-5 fw-normal mt-4 opacity-75">
              <br />
              La app sigue en fase de desarollo, eventualmente limitaré la cantidad de eventos simultáneos por
              usuario, pero por ahora usen la app tanto como necesiten!
            </p>
          </div>
          {innerWidth > 800 && <div className="col-sm-4 py-3 justify-content-center d-flex">
            <CalendarSVG height="90%" width="100%" />
          </div>}
        </div>
        {store.loggedIn ? (
          <Grid container justifyContent={"center"} className="mx-2 mb-5 mt-2">
            <Link
              to="/dashboard"
              className="mx-2 fs-5 py-2 btn btn-primary px-5 fw-semibold mb-2"
            >
              Ir a mis eventos
            </Link>{" "}
            <Link
              to="/create#createHeader"
              className="mx-2 fs-5 py-2 btn btn-success px-5 fw-semibold mb-2"
            >
              Crear un nuevo evento
            </Link>
          </Grid>
        ) : (
          <div className="row">
            <Link
              to="/login"
              className="mx-2 mb-5 mt-5 fs-5 py-2 btn btn-primary px-5 fw-semibold mb-2"
            >
              ¡Empezar Ahora!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bienvenida;
