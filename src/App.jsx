import { Routes, Route } from "react-router-dom";

// Páginas públicas
import Login from "../src/pages/Auth/Login";
import Register from "../src/pages/Auth/Register";
import ForgotPassword from "../src/pages/Auth/ForgotPassword"; // 🆕
import TodosLosProyectos from "../src/pages/Explore/TodosLosProyectos";
import MasInformacion from "../src/pages/Explore/MasInformacion";

// Páginas privadas
import Profile from "../src/pages/Profile/Profile";
import NewProject from "../src/pages/Profile/NewProject";
import UserProfile from "../src/pages/Profile/UserProfile";
import ProyectoDetalle from "../src/pages/ProjectView/ProyectoDetalle";
import EditarPerfil from "../src/pages/Profile/EditarPerfil";

// Componentes
import PrivateRoute from "../src/components/PrivateRoute";
import ThemeToggle from "../src/components/ThemeToggle";

function App() {
  return (
    <>
      <ThemeToggle />

      <Routes>
        {/* 🌐 Rutas Públicas */}
        <Route path="/" element={<TodosLosProyectos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/todoslosproyectos" element={<TodosLosProyectos />} />
        <Route path="/explore" element={<TodosLosProyectos />} />
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
  path="/profile/view"
  element={
    <PrivateRoute>
      <UserProfile />
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
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <EditarPerfil />
            </PrivateRoute>
          }
        />
        <Route
          path="/project"
          element={
            <PrivateRoute>
              <ProyectoDetalle />
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