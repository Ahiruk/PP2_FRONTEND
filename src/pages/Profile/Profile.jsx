import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import ProjectCard from "../../components/ProjectCard";
import { Link} from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchProjects = async () => {
      try {
          const q = query(collection(db, "projects"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const userProjects = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          }));
          setProjects(userProjects);
      } catch (error) {
          console.error("Error al obtener proyectos:", error);
      } finally {
          setLoading(false);
      }
  };

  const handleDelete = async (id) => {
      const confirm = window.confirm("¿Estás seguro de que deseas eliminar este proyecto?");
      if (!confirm) return;

      try {
          await deleteDoc(doc(db, "projects", id));
          setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
          console.error("Error al eliminar proyecto:", error);
      }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  if (loading) return <p className="text-center mt-4">Cargando proyectos...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Proyectos</h1>
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
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={() => handleDelete(project.id)}
              isOwner={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
// Este componente muestra la lista de proyectos del usuario autenticado. Si no hay proyectos, muestra un mensaje indicando que no hay proyectos aún.
// El botón "Nuevo Proyecto" redirige al usuario a la página de creación de un nuevo proyecto.
