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
import PerfilProfesional from "../src/pages/Profile/PerfilProfesional"; // 🆕
import PerfilPublico from "../src/pages/Profile/PerfilPublico"; // 🆕
import Comunidades from "../src/pages/Explore/Comunidades"; // 🆕
import CrearComunidad from "../src/pages/ProjectView/CrearComunidad";


// Componentes
import PrivateRoute from "../src/components/PrivateRoute";
import ThemeToggle from "../src/components/ThemeToggle";

import FloatingMenu from "./components/FloatingMenu";
import { User, FileText, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "./services/firebase";        // ← 1)  trae auth
import { useNavigate } from "react-router-dom";


function App() {

  const navigate = useNavigate();          // ← 3)  crea navigate

  const handleLogout = async () => {
    try {
      await signOut(auth);                 // auth ya existe
      navigate("/login");                  // ahora también navigate
    } catch (error) {
      alert("Error al cerrar sesión: " + error.message);
    }
  };

  const menuItems = [
    { icon: User, label: "Perfil", to: "/profile/view" },
    { icon: FileText, label: "CV", to: "/profile/cv" },
    { icon: LogOut, label: "Salir", onClick: handleLogout }, // ← aquí
  ];

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
          path="/profile/cv"
          element={
            <PrivateRoute>
              <PerfilProfesional />
            </PrivateRoute>
          }
        />

        <Route path="/profile/:uid" element={<PerfilPublico />} />


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
      <FloatingMenu items={menuItems} />
    </>
  );
}

export default App;

// Este es el componente principal de la aplicación. Define las rutas de la aplicación utilizando react-router-dom.
// Las rutas públicas incluyen el inicio de sesión, registro, exploración y detalles del proyecto.