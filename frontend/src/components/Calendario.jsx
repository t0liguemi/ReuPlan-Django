import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/context";
import "./calendario.css";
const Calendar = () => {
  const { store, actions } = useContext(Context);
  const dateOptionsDayOnly = {
    timeZone: "America/Santiago", // Continental Chile time zone
    weekday: "long", // Full name of the day of the week
  };

  function localizedDay(anno, mes, dia) {
    return (
      new Date(
        anno.slice(1) + "-" + mes.slice(1) + "-" + dia.slice(1) + "T12:00:00"
      )
        .toLocaleDateString("es-cl", dateOptionsDayOnly)
        .charAt(0)
        .toUpperCase() +
      new Date(
        anno.slice(1) + "-" + mes.slice(1) + "-" + dia.slice(1) + "T12:00:00"
      )
        .toLocaleDateString("es-cl", dateOptionsDayOnly)
        .slice(1)
    );
  }

  useEffect(() => {
    actions.countCalendar();
    actions.checkEachInviteesResponses();
  }, [store.currentEventResponses, store.fetchedEvent]);
  //<h4>{new Date('2024-03-30'+'T12:00:00').toLocaleDateString("es-cl",dateOptionsDayOnly)}</h4>
  return (
    <div className="mainCalendario px-0 mx-auto my-4 overflow-x-scroll">
      <div className="d-flex ">
        {store.horarios != undefined &&
          store.horarios.map(([anno, mes, dia, horario]) => {
            return (
              <div className="columnaDia" key={"diaCalendario" + mes + dia}>
                <div className="d-flex justify-content-center fw-semibold py-0">
                  {localizedDay(anno, mes, dia)}
                </div>
                <div className="d-flex justify-content-center fw-semibold">
                  {dia.slice(1, 3) +
                    "/" +
                    mes.slice(1, 3) +
                    "/" +
                    anno.slice(1)}
                </div>
                <div className="timeStack gap-0">
                  {horario.map(([inicio, final]) => {
                    return (
                      <div
                        key={"bloqueInicia" + inicio}
                        className="greenBlock my-0 py-0"
                        style={{
                          height:
                            (final * 100) / 24 - (inicio * 100) / 24 + "%",
                          position: "sticky",
                          top: (inicio * 100) / 24 + "%",
                          padding: 0,
                          overflow: "hidden",
                        }}
                      >
                        {parseInt(inicio) +
                          ":" +
                          "00 - " +
                          parseInt(final) +
                          ":" +
                          "00"}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Calendar;
