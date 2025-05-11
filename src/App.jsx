import { Routes, Route } from "react-router-dom";
import Login from "../src/pages/Auth/Login"; // "Iniciar sesión"
import Register from "../src/pages/Auth/Register"; // "Registro"
import Profile from "../src/pages/Profile/Profile"; // "Mi Perfil"
//import NewProject from "./pages/NewProject";
//import EditProject from "./pages/EditProject";
//import Explore from "./pages/Explore";
//import ProjectDetail from "./pages/ProjectDetail";
import PrivateRoute from "../src/components/PrivateRoute"; // "Ruta Privada"

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
     {/*  <Route path="/explore" element={<Explore />} /> */}
      {/* <Route path="/project/:id" element={<ProjectDetail />} /> */}

      {/* Rutas privadas */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/profile/new"
        element={
          <PrivateRoute>
            <NewProject />
          </PrivateRoute>
        }
      /> */}
      {/* <Route
        path="/profile/edit/:id"
        element={
          <PrivateRoute>
            <EditProject />
          </PrivateRoute>
        }
      /> */}
    </Routes>
  );
}

export default App;
// Este es el componente principal de la aplicación. Define las rutas de la aplicación utilizando react-router-dom.
// Las rutas públicas incluyen el inicio de sesión, registro, exploración y detalles del proyecto.