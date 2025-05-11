import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
// Este componente verifica si el usuario está autenticado. Si no lo está, redirige a la página de inicio de sesión.
// Si el usuario está autenticado, renderiza los hijos del componente (es decir, la ruta protegida).