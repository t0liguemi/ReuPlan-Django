import { useEffect, useContext } from "react";
import { Context } from "../store/context";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function Activate() {
  const { store, actions } = useContext(Context);
  const { key } = useParams();
  const navigate = useNavigate()
  console.log(key);

  useEffect(() => {
      actions.attemptActivation(key,navigate);
    
  }, []);

  return store.accountActivated ? (
    <div className="container py-2">
      <h2 className="fw-semibold mb-0">Tu cuenta ha sido activada!</h2>
      <p className="fs-5 fw-light my-2">Ahora puedes iniciar sesión.</p>
    </div>
  ) : store.activationFailed ? (
    <div className="container py-2">
      <h2 className="fw-semibold mb-0">Error al activar tu cuenta</h2>
      <p className="fs-5 fw-light my-2">
        No se ha podido activar una cuenta con este enlace.
      </p>
    </div>
  ) : (
    <div className="d-flex justify-content-center align-content-center my-5 py-5">
      <div className="spinner-border" role="status"></div>
    </div>
  );
}
