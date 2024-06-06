import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function Contact() {
  const navigate = useNavigate()
  const backendURL = import.meta.env.DEV
    ? import.meta.env.VITE_APP_BACKEND_URL
    : "";

    function getCsrfToken() {
      return document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");
    }
    
    const csrfToken = getCsrfToken();


  function handleSubmit(event) {
    event.preventDefault();
    fetch(backendURL + "api/contact", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrfToken,
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
      } else {toast.error("No se ha podido enviar el mensaje")}
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
