import { Box, Grid } from "@mui/material";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="container py-4">
      <Grid container spacing={2} justifyContent="center">
        <Grid item  xs={12} sm={6}>
          <Link style={{textDecoration:"none"}}>
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
              Eventos creados por ti, sin importar si eres participante
            </small>
          </Box></Link>
        </Grid>
        <Grid item  xs={12} sm={6}>
          <Link style={{textDecoration:"none"}}>
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
              Eventos, para los que recibiste una invitación, a los que aún no
              has ingresado una respuesta
            </small>
          </Box></Link>
        </Grid>
        <Grid item  xs={12} sm={6}>
          <Link style={{textDecoration:"none"}}>
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
            <small className="text-light">Eventos a los que ingresaste horarios de asistencia</small>
          </Box></Link>
        </Grid>
        <Grid item  xs={12} sm={6}>
          <Link style={{textDecoration:"none"}}>
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
            <small className="text-light">Eventos a los cuales no asistirás</small>
          </Box></Link>
        </Grid>
      </Grid>
    </div>
  );
}
