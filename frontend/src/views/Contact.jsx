import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function Contact() {
  const navigate = useNavigate()
  const backendURL = import.meta.env.DEV
    ? import.meta.env.VITE_APP_BACKEND_URL
    : "";

  function handleSubmit(event) {
    fetch(backendURL + "api/contact", {
      credentials:"include",
      method: "POST",
      headers: {
        "X-CSRFToken": localStorage.getItem("reuPlanToken"),
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: event.target.email.value,
        name: event.target.username.value,
        message: event.target.message.value,
      }),
    }).then((response) => {
      if (response.status === 200) {
        toast.success("Mensaje enviado con éxito");
        navigate("/")
      }
    });
  }
  return (
    <div className="container py-5">
      <h2 className="fw-semibold">Contacto</h2>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="d-flex">
          <label htmlFor="username" className="fw-semibold me-3 my-1">
            Nombre
            <input className="form-control" id="username" required />
          </label>
          <label htmlFor="email" className="fw-semibold my-1" required>
            Email
            <input className="form-control " id="email" />
          </label>
        </div>
        <label htmlFor="message" className="fw-semibold my-1">
          Mensaje
        </label>
        <textarea className="form-control" id="message" required />
        <button className="btn btn-primary my-3 fw-semibold" type="submit">
          Enviar
        </button>
      </form>
    </div>
  );
}
export default Contact;
