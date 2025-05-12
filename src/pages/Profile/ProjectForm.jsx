import { useState } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./ProjectForm.css";

const ProjectForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Envío de formulario: crea el proyecto y redirige
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !description.trim()) {
      return setError("Todos los campos son obligatorios");
    }
    try {
      setLoading(true);
      await addDoc(collection(db, "projects"), {
        title,
        description,
        uid: user.uid,
        authorName: user.email,
        createdAt: serverTimestamp(),
      });
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Error al guardar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  // Botón “Volver”: redirige sin guardar
  const handleBackToProfile = () => {
    navigate("/profile");
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      {/* Error en validación */}
      {error && <p className="error-text">{error}</p>}

      {/* Campo: Título */}
      <div className="form-group">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Campo: Descripción */}
      <div className="form-group">
        <label htmlFor="description">Descripción breve</label>
        <textarea
          id="description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Acciones: Guardar / Volver */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Proyecto"}
        </button>

        <button
          type="button"
          onClick={handleBackToProfile}
          className="btn btn-secondary"
        >
          Volver a mis proyectos
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
