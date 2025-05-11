import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/profile/edit/${project.id}`);
  };

  const handleDelete = async () => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar este proyecto?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "projects", project.id));
      window.location.reload(); // simple recarga por ahora
    } catch (err) {
      console.error("Error al eliminar proyecto:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{project.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{project.description}</p>
      <div className="flex gap-2">
        <button
          onClick={handleEdit}
          className="text-sm px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
// Este componente muestra la información de un proyecto específico, incluyendo su título y descripción.
// También incluye botones para editar y eliminar el proyecto. La función de eliminación pregunta al usuario si está seguro antes de proceder.