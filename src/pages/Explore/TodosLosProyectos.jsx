// src/pages/Explore/TodosLosProyectos.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Link, useNavigate } from "react-router-dom";
import "./TodosProyectos.css";

const TodosLosProyectos = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ⇢ Trae todos los proyectos públicos (no eliminados)
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "projects"));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setProjects(all.filter(p => p.deleted !== true));
      } catch (e) {
        console.error("❌ Error al obtener proyectos:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- Loader ---------- */
  if (loading)
    return (
      <div className="loading-container">
        <div className="loader" />
        <p className="loading-text">Cargando todos los proyectos…</p>
      </div>
    );

  return (
    <div className="todos-container">
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <h1>Mi OpenLab</h1>
        <p>Explora proyectos públicos o comparte los tuyos con la comunidad.</p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Regístrate
          </button>
    
           
        
        </div>

        <button className="login-link" onClick={() => navigate("/login")}>
          Iniciar sesión
        </button>
      </section>

      {/* ---------- LISTA DE PROYECTOS ---------- */}
      <section id="lista-proyectos">
        <h2 className="todos-title">Proyectos públicos</h2>

        {projects.length === 0 ? (
          <p className="no-projects">No hay proyectos disponibles.</p>
        ) : (
          <div className="todos-grid">
            {projects.map(p => (
              <div key={p.id} className="todos-card">
                <h3>{p.title}</h3>
                <p>Autor: {p.authorName || "Anónimo"}</p>
                <Link to={`/proyecto/${p.id}`}>Más información</Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TodosLosProyectos;



// Este componente muestra todos los proyectos disponibles en la base de datos.
// Permite a los usuarios navegar a la página de inicio de sesión y ver detalles de cada proyecto.