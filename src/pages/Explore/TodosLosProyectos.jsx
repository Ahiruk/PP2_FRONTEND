import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Link } from "react-router-dom";

const TodosLosProyectos = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchAllProjects();
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando todos los proyectos...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Todos los Proyectos</h1>

      {projects.length === 0 ? (
        <p className="text-gray-600">No hay proyectos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <div key={project.id} className="border rounded-xl p-4 shadow-sm bg-white">
              <h2 className="text-xl font-semibold text-blue-700 mb-1">
                Título: {project.title}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Autor: {project.authorName || "Anónimo"}
              </p>
              <Link
                to={`/proyecto/${project.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Más información
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodosLosProyectos;
