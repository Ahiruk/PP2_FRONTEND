import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import ProjectCard from "../../components/ProjectCard";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      const q = query(collection(db, "projects"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProjects(results);
    };

    fetchProjects();
  }, [user]);

  const handleNewProject = () => {
    navigate("/profile/new");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Proyectos</h1>
      <button
        onClick={handleNewProject}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Nuevo Proyecto
      </button>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <p>No tienes proyectos aún.</p>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
// Este componente muestra la lista de proyectos del usuario autenticado. Si no hay proyectos, muestra un mensaje indicando que no hay proyectos aún.
// El botón "Nuevo Proyecto" redirige al usuario a la página de creación de un nuevo proyecto.
