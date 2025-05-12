import { useState } from 'react';
import { db } from '../../services/firebase'; // Asegúrate de tener la config aquí
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import "./ProjectForm.css";


const ProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      return setError('Todos los campos son obligatorios');
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'projects'), {
        title,
        description,
        uid: user.uid,
        authorName: user.email,
        createdAt: serverTimestamp(),
      });
      navigate('/profile'); // Redirigir a la página de perfil después de guardar el proyecto
    } catch (err) {
      setError('Error al guardar el proyecto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToProfile = () => {
    navigate('/profile'); // Redirigir a la página de perfil
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
  {error && <p className="error-text">{error}</p>}

  <div className="form-group">
    <label>Título</label>
    <input
      type="text"
      value={title}
      onChange={e => setTitle(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label>Descripción breve</label>
    <textarea
      rows="4"
      value={description}
      onChange={e => setDescription(e.target.value)}
      required
    />
  </div>

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

// Este componente es un formulario para crear o editar proyectos. Permite al usuario ingresar un título y una descripción.
// Al enviar el formulario, se guarda el proyecto en Firestore y se redirige al usuario a su perfil. También maneja errores y muestra un mensaje de carga mientras se guarda el proyecto.