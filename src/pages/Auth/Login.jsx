import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isInstitutionalEmail = (email) => {
    return email.endsWith("@uninorte.edu.co");
  };
  

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (!isInstitutionalEmail(email)) {
      setError("Solo se permite el correo institucional @uninorte.edu.co");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No existe una cuenta con este correo.");
      } else if (err.code === "auth/wrong-password") {
        setError("Contraseña incorrecta.");
      } else if (err.code === "auth/invalid-email") {
        setError("Correo no válido.");
      } else {
        setError("Error al iniciar sesión.");
      }
    }
  };
  

  const goToTodosLosProyectos = () => {
    navigate("/todoslosproyectos");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-header">
          <h2 className="login-title">Iniciar Sesión</h2>
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="form-body">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className={`input-field ${error.includes("correo") ? "shake" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder = "usuario@uninorte.edu.co"

            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className={`input-field ${error.includes("Contraseña") ? "shake" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary">
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={goToTodosLosProyectos}
            className="btn-secondary"
          >
            Ver todos los proyectos
          </button>
        </div>

        <div className="form-footer">
          <p>
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="link-register">
              Crear una cuenta
            </Link>
            {/* Enlace para recuperar contraseña */}
          <div className="forgot-password-link">
            <Link to="/forgot-password" className="link-forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
