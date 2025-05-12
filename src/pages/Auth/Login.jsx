import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate, Link } from "react-router-dom"; // 👈 Importar Link

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
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
    <div className = "login-container">
      <form
        onSubmit={handleLogin}
        className = "login-form"
      >
        <h2 className = "login-title" >
          Iniciar Sesión
        </h2>

        {error && (
          <p className="error-message">{error}</p>
        )}

        <div  className = "input-field">
          <label label className = "input-label ">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className = "input-field" >
          <label className = "input-label" >
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className = "submit-btn"
        >
          Iniciar sesión
        </button>

        <button
          type="button"
          onClick={goToTodosLosProyectos}
          className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition"
        >
          Ver todos los proyectos
        </button>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Crear una cuenta
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

// Este componente de inicio de sesión utiliza Firebase Authentication para autenticar a los usuarios.
// Se utiliza el hook useState para manejar el estado del correo electrónico, la contraseña y los errores.