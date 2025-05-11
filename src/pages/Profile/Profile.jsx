import { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!user?.uid) return; // Si el usuario no está logueado, no hacer nada

    try {
      // Filtrar proyectos donde el uid coincide con el uid del usuario logueado
      const q = query(collection(db, "projects"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("📦 Proyectos del usuario:", results);
      setProjects(results);
    } catch (error) {
      console.error("❌ Error al obtener proyectos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Eliminar este proyecto?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar proyecto:", error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      console.log("✅ Usuario autenticado:", user.uid);
      fetchProjects();
    }
  }, [user]);

  if (loading) return <p className="text-center mt-4">Cargando proyectos...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-1">Tus Proyectos</h1>
      {user && (
        <div>
          <p className="text-gray-600 mb-4">
            Conectado como: <span className="font-medium">{user.email}</span>
          </p>
          {/* Mostrar el UID del usuario logueado */}
        </div>
      )}

      <div className="mb-4">
        <Link
          to="/profile/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo Proyecto
        </Link>
      </div>

      {projects.length === 0 ? (
        <p>No tienes proyectos aún.</p>
      ) : (
        <div className="grid gap-4">
          {projects.map(project => (
            <div key={project.id} className="border p-4 rounded shadow-sm">
              {/* Mostrar solo el título y la descripción con el prefijo */}
              <h2 className="text-xl font-semibold">
                Título: {project.title}
              </h2>
              <p className="text-gray-700">
                Descripción: {project.description}
              </p>
              <button
                onClick={() => handleDelete(project.id)}
                className="mt-2 text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

// Este componente muestra la lista de proyectos del usuario autenticado. Si no hay proyectos, muestra un mensaje indicando que no hay proyectos aún.
// El botón "Nuevo Proyecto" redirige al usuario a la página de creación de un nuevo proyecto.
