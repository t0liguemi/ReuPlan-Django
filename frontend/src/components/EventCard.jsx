import { Card } from "@mui/material";
import { Grid } from "@mui/material";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";

export default function EventCard(props) {
  const { event } = props;
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Chile/Continental",
  };
  return (
    <Grid item xl={3} lg={4} md={6} xs={12} key={`key-${event.id}`}>
      <Link className="text-decoration-none" to={`/event/${event.id}`}>
        <Card className="p-3 d-flex flex-column justify-content-center align-items-center eventCardComponent">
          <h5>{event.name}</h5>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip
                id={`date-tooltip-${event.id}`}
                className="custom-tooltip"
              >
                {event.inicio == event.final ? (
                  <>
                    El{" "}
                    {new Date(event.inicio + "T12:00:00").toLocaleDateString(
                      "es",
                      dateOptions
                    )}
                  </>
                ) : (
                  <>
                    De{" "}
                    {new Date(event.inicio + "T12:00:00").toLocaleDateString(
                      "es",
                      dateOptions
                    )}{" "}
                    al{" "}
                    {new Date(event.final + "T12:00:00").toLocaleDateString(
                      "es",
                      dateOptions
                    )}
                  </>
                )}
              </Tooltip>
            }
          >
            <p>
              {event.inicio == event.final ? (
                <span className="text-secondary">
                  {event.inicio.slice(8, 10) +
                    "/" +
                    event.inicio.slice(5, 7) +
                    "/" +
                    event.inicio.slice(0, 4)}
                </span>
              ) : (
                <>
                  <span className="text-secondary">
                    {event.inicio.slice(8, 10) +
                      "/" +
                      event.inicio.slice(5, 7) +
                      "/" +
                      event.inicio.slice(0, 4)}
                  </span>{" "}
                  al{" "}
                  <span className="text-secondary">
                    {event.final.slice(8, 10) +
                      "/" +
                      event.final.slice(5, 7) +
                      "/" +
                      event.final.slice(0, 4)}
                  </span>
                </>
              )}
            </p>
          </OverlayTrigger>
          <p>{event.lugar}</p>
        </Card>
      </Link>
    </Grid>
  );
}
