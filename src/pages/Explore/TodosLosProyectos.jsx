// TodosLosProyectos.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Link, useNavigate } from "react-router-dom";
import "./TodosProyectos.css";

const TodosLosProyectos = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setProjects(results);
      } catch (error) {
        console.error("❌ Error al obtener todos los proyectos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, []);

  // if (loading) {
  //   return <p className="loading">Cargando todos los proyectos...</p>;
  // }
  if (loading) {
  return (
    <div className="loading-container">
      <div className="loader"></div>
      <p className="loading-text">Cargando todos los proyectos...</p>
    </div>
  );
}



  return (
    <div className="todos-container">
      <header className="todos-header">
        <h1>Todos los Proyectos</h1>
        <button onClick={() => navigate("/login")}>Ir al login</button>
      </header>

      {projects.length === 0 ? (
        <p className="no-projects">No hay proyectos disponibles.</p>
      ) : (
        <div className="todos-grid">
          {projects.map(proj => (
            <div key={proj.id} className="todos-card">
              <h2>{proj.title}</h2>
              <p>Autor: {proj.authorName || "Anónimo"}</p>
              <Link to={`/proyecto/${proj.id}`}>Más información</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodosLosProyectos;
// Este componente muestra todos los proyectos disponibles en la base de datos.
// Permite a los usuarios navegar a la página de inicio de sesión y ver detalles de cada proyecto.