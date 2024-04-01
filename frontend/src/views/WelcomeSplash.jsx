import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";


import imagen1 from "../resources/edited-carrousel/image-1.jpg";
import imagen2 from "../resources/edited-carrousel/image-2.jpg";
import imagen3 from "../resources/edited-carrousel/image-3.jpg";
import imagen4 from "../resources/edited-carrousel/image-4.jpg";
import imagen5 from "../resources/edited-carrousel/image-5.jpg";
import imagen6 from "../resources/edited-carrousel/image-6.jpg";
import imagen7 from "../resources/edited-carrousel/image-7.jpg";

import CalendarSVG from "../resources/Calendarios.svg?react";

const Bienvenida = () => {
  const imagenes = [
    imagen1,
    imagen2,
    imagen3,
    imagen4,
    imagen5,
    imagen6,
    imagen7,
  ];

  const [indice, setIndice] = useState(0);

  const cambiarImagen = useCallback(() => {
    setIndice((prevIndice) => (prevIndice + 1) % imagenes.length);
  }, [imagenes]);

  useEffect(() => {
    const intervalo = setInterval(cambiarImagen, 5000);
    return () => clearInterval(intervalo);
  }, [cambiarImagen]);

  return (
    <div>
      <div
        id="carouselWelcome"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={imagen1} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={imagen2} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={imagen3} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={imagen4} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={imagen5} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={imagen6} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src={imagen7} className="d-block w-100" alt="..." />
          </div>
        </div>
      </div>
      <div className="container pb-3">
        <div className="row">
          <div className="row mt-5">
            <div className="col-sm-5" >
              <span className="fs-2 fw-bold ">
                ¡Crea tu reunión en un par de clics con{" "}
              </span>
              <span className="text-primary fs-2 fw-bold ">Reu </span>
              <span className="text-success fs-2 fw-bold ">Plan </span>
              <span className=" fs-2 fw-bold ">
                {" "}
                y solo espera a que nuestro calendario muestre el mejor momento!
              </span>
              <p className="mt-4 fs-5 fw-semibold">
                ¡Disfruta de tus eventos simplemente haciéndolos! Con ReuPlan
                puedes organizar tus reuniones en tiempo récord, sin tener que
                ocuparte de la disponibilidad. ¡Sólo establece en qué período de
                tiempo debería ocurrir, y tus invitados te indicarán con toda
                facilidad cuándo pueden asistir y la aplicación te indicará en
                qué momento es posible llevar a cabo tu evento y ya está!
                ¡Reunirse nunca fue tan fácil!
              </p>
            </div>
            <div className="col-sm-4 py-3 justify-content-center d-flex">
              <CalendarSVG height="90%" width="100%"/>
            </div>
            </div>
            <div className="row">
            <Link
              to="/login"
              className="mx-2 fs-5 py-2 btn btn-success px-5 fw-semibold mb-2"
            >
              ¡Empezar Ahora!
            </Link>
            <Link
              to="/about"
              className="mx-2 fs-5 py-2 btn btn-primary px-5 fw-semibold"
            >
              Conoce mas!
            </Link>
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default Bienvenida;
