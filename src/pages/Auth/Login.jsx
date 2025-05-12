import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
            Correo electrónico
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
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
      </form>
    </div>
  );
};

export default Login;

// Este componente de inicio de sesión utiliza Firebase Authentication para autenticar a los usuarios.
// Se utiliza el hook useState para manejar el estado del correo electrónico, la contraseña y los errores.