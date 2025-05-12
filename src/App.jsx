import { Routes, Route } from "react-router-dom";

// Páginas públicas
import Login from "../src/pages/Auth/Login";
import Register from "../src/pages/Auth/Register";
import TodosLosProyectos from "../src/pages/Explore/TodosLosProyectos";
import MasInformacion from "../src/pages/Explore/MasInformacion";

// Páginas privadas
import Profile from "../src/pages/Profile/Profile";
import NewProject from "../src/pages/Profile/NewProject";

// Componentes
import PrivateRoute from "../src/components/PrivateRoute";
import ThemeToggle from "../src/components/ThemeToggle"; // 🌙 Botón de tema

function App() {
  return (
    <>
      {/* Botón flotante para cambiar entre modo claro/oscuro */}
      <ThemeToggle />

      <Routes>
        {/* 🌐 Rutas Públicas */}
        <Route path="/" element={<TodosLosProyectos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todoslosproyectos" element={<TodosLosProyectos />} />
        <Route path="/proyecto/:id" element={<MasInformacion />} />

        {/* 🔒 Rutas Privadas */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/new"
          element={
            <PrivateRoute>
              <NewProject />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

// Este es el componente principal de la aplicación. Define las rutas de la aplicación utilizando react-router-dom.
// Las rutas públicas incluyen el inicio de sesión, registro, exploración y detalles del proyecto.