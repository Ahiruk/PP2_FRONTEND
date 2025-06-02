import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMensaje("Se ha enviado un enlace de recuperación al correo institucional.");
    } catch (err) {
    console.error("Error al enviar el correo de recuperación:", err);
    setError("No se pudo enviar el correo. Verifica el email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <form onSubmit={handleReset} className="forgot-form">
        <h2 className="forgot-title">Recuperar Contraseña</h2>

        {mensaje && (
          <p className="success-message">
            <CheckCircle size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            {mensaje}
          </p>
        )}
        {error && (
          <p className="error-message">
            <XCircle size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            {error}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="email">Correo institucional</label>
          <input
            type="email"
            id="email"
            placeholder="usuario@uninorte.edu.co"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace de recuperación"}
        </button>

        <p className="login-link-text">
          ¿Ya recordaste tu contraseña? <Link to="/login" className="login-link">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
