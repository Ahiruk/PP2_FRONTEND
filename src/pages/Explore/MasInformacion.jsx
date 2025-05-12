// MasInformacion.jsx
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useEffect, useState } from "react";
import "./MasInformacion.css";

const MasInformacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const ref = doc(db, "projects", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProject({ id: snap.id, ...snap.data() });
        } else {
          console.warn("⚠️ Proyecto no encontrado.");
        }
      } catch (error) {
        console.error("❌ Error al obtener el proyecto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const goBack = () => navigate("/todoslosproyectos");

  // if (loading) return <p className="mi-loading">Cargando proyecto...</p>;
  
  // if (!project) return <p className="mi-error">Proyecto no encontrado.</p>;
 if (loading) {
    return (
      <div className="mi-loading-container">
        <div className="loader"></div>
        <p className="mi-loading-text">Cargando proyecto...</p>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="mi-loading-container">
        <p className="mi-error">Proyecto no encontrado.</p>
      </div>
    );
  }



  return (
    <div className="mi-container">
      <header className="mi-header">
        <h1>Detalles del Proyecto</h1>
      </header>

      <div className="mi-card">
        <p><span className="mi-label">Título:</span> {project.title}</p>
        <p><span className="mi-label">Descripción:</span> {project.description || "No disponible"}</p>
        <p><span className="mi-label">Autor:</span> {project.authorName || "Anónimo"}</p>
        <p>
          <span className="mi-label">Fecha de creación:</span>{" "}
          {project.createdAt?.toDate?.().toLocaleString?.() || "No disponible"}
        </p>
      </div>

      <button className="mi-btn" onClick={goBack}>
        ← Volver
      </button>
    </div>
  );
};

export default MasInformacion;
// Este componente muestra la información detallada de un proyecto específico.
// Incluye el título, descripción, autor y fecha de creación. También incluye un botón para volver a la lista de proyectos.