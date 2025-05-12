import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.uid) return;
      try {
        const q = query(
          collection(db, "projects"),
          where("uid", "==", user.uid)
        );
        const snap = await getDocs(q);
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  const handleDelete = async id => {
    if (!window.confirm("¿Eliminar este proyecto?")) return;
    await deleteDoc(doc(db, "projects", id));
    setProjects(p => p.filter(x => x.id !== id));
  };

  const handleEdit = proj => {
    setEditingProject(proj);
    setEditedTitle(proj.title);
    setEditedDescription(proj.description);
  };

  const handleSave = async () => {
    if (!editedTitle.trim() || !editedDescription.trim()) {
      return alert("Por favor completa todos los campos");
    }
    const ref = doc(db, "projects", editingProject.id);
    await updateDoc(ref, {
      title: editedTitle,
      description: editedDescription,
    });
    setProjects(ps =>
      ps.map(p =>
        p.id === editingProject.id
          ? { ...p, title: editedTitle, description: editedDescription }
          : p
      )
    );
    setEditingProject(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) return <p className="loading">Cargando proyectos...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Tus Proyectos</h1>
        {user && (
          <p className="subtext">
            Conectado como: <span>{user.email}</span>
          </p>
        )}
        <div className="separator" />
      </div>

      <Link to="/profile/new" className="btn-new">
        + Nuevo Proyecto
      </Link>

      {projects.length === 0 ? (
        <p className="no-projects">No tienes proyectos aún.</p>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className="project-actions">
                <button onClick={() => handleEdit(project)}>Editar</button>
                <button
                  className="delete"
                  onClick={() => handleDelete(project.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingProject && (
  <>
    <div className="modal-backdrop" />
    <div className="edit-form">
      <h3>Editar Proyecto</h3>
      <label>Título:</label>
      <input
        value={editedTitle}
        onChange={e => setEditedTitle(e.target.value)}
      />
      <label>Descripción:</label>
      <textarea
        value={editedDescription}
        onChange={e => setEditedDescription(e.target.value)}
      />
      <button onClick={handleSave} className="btn-save">
        Guardar Cambios
      </button>
      <button onClick={() => setEditingProject(null)} className="btn-cancel">
        Cancelar
      </button>
    </div>
  </>
)}


      <button onClick={handleLogout} className="btn-new delete logout">
        Cerrar sesión
      </button>
    </div>
  );
};

export default Profile;
// Este componente muestra la información del perfil del usuario, incluyendo sus proyectos.
// Permite editar y eliminar proyectos, así como cerrar sesión. Utiliza Firebase para la autenticación y la gestión de datos.