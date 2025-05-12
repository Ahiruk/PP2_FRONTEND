import { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase"; // Importa la referencia de Firebase Auth
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null); // Para saber qué proyecto estamos editando
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const navigate = useNavigate();

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

  const handleEdit = (project) => {
    setEditingProject(project);
    setEditedTitle(project.title);
    setEditedDescription(project.description);
  };

  const handleSave = async () => {
    if (!editedTitle || !editedDescription) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const projectRef = doc(db, "projects", editingProject.id);
      await updateDoc(projectRef, {
        title: editedTitle,
        description: editedDescription,
      });

      // Actualizar el proyecto en el estado local
      setProjects(prev =>
        prev.map(project =>
          project.id === editingProject.id
            ? { ...project, title: editedTitle, description: editedDescription }
            : project
        )
      );

      setEditingProject(null); // Cerrar el formulario de edición
      setEditedTitle(""); // Limpiar campos
      setEditedDescription("");
    } catch (error) {
      console.error("❌ Error al actualizar proyecto:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirige al login después de desloguearse
    } catch (error) {
      console.error("❌ Error al desloguearse:", error);
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
    <div className = "profile-container">
    <div className = "profile-header" >
      <h1>Tus Proyectos</h1>
      {user && (
        <div>
          <p className="text-gray-600 mb-4">
            Conectado como: <span className="font-medium">{user.email}</span>
          </p>
        </div>
      )}
      <div className = "separator" / >
      </div>

 <Link to="/profile/new" className="btn-new">
     + Nuevo Proyecto
  </Link>

      {projects.length === 0 ? (
        <p>No tienes proyectos aún.</p>
      ) : (
        <div className="projects-grid">
        {projects.map(project => (
           <div key={project.id} className="project-card">
             <h2>{project.title}</h2>
            <p>{project.description}</p>
              <div className="project-actions">
                <button onClick={() => handleEdit(project)}>Editar</button>
                <button className="delete" onClick={() => handleDelete(project.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingProject && (
        <div className="mt-4 border p-4 rounded shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Editar Proyecto</h3>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="title">
              Título:
            </label>
            <input
              type="text"
              id="title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="description">
              Descripción:
            </label>
            <textarea
              id="description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar Cambios
          </button>
          <button
            onClick={() => setEditingProject(null)}
            className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleLogout}
         className = "btn-new delete"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Profile;

// Este componente muestra la lista de proyectos del usuario autenticado. Si no hay proyectos, muestra un mensaje indicando que no hay proyectos aún.
// El botón "Nuevo Proyecto" redirige al usuario a la página de creación de un nuevo proyecto.
