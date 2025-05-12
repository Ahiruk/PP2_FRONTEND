import { useState } from 'react';
import { db } from '../../services/firebase'; // Asegúrate de tener la config aquí
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block font-semibold">Título</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Descripción breve</label>
        <textarea
          className="w-full border p-2 rounded"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Guardando...' : 'Guardar Proyecto'}
        </button>

        <button
          type="button"
          onClick={handleBackToProfile}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
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