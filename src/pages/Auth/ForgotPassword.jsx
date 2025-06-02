import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase";
import { Link } from "react-router-dom";
import "./ForgotPassword.css"; // <-- Importar estilos

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMensaje("Se ha enviado un enlace de recuperación al correo.");
    } catch (err) {
      setError("No se pudo enviar el correo. Verifica el email.");
    }
  };

  return (
    <div className="forgot-container">
      <form onSubmit={handleReset} className="forgot-form">
        <h2>Recuperar contraseña</h2>

        {mensaje && <p className="success-message">{mensaje}</p>}
        {error && <p className="error-message">{error}</p>}

        <label htmlFor="email">Correo electrónico:</label>
        <input
          type="email"
          id="email"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Enviar enlace de recuperación</button>

        <p>
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
