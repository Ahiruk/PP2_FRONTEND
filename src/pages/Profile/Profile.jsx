import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);

  // Campos para edición
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedTag, setEditedTag] = useState("JavaScript");
  const [editedVisibility, setEditedVisibility] = useState("public");
  const [editedGithubLink, setEditedGithubLink] = useState("");
  const [editedVideoLink, setEditedVideoLink] = useState("");
  const [editedImageFile, setEditedImageFile] = useState(null);
  const [editedImageUrl, setEditedImageUrl] = useState("");

  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.uid) return;
      try {
        const q = query(
          collection(db, "projects"),
          where("uid", "==", user.uid)
        );
        const snap = await getDocs(q);
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProjects(all.filter((p) => p.deleted !== true));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    if (!json.secure_url)
      throw new Error("Error al subir imagen a Cloudinary");
    return json.secure_url;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este proyecto?")) return;
    const ref = doc(db, "projects", id);
    await updateDoc(ref, { deleted: true });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEdit = (proj) => {
    setEditingProject(proj);
    setEditedTitle(proj.title || "");
    setEditedDescription(proj.description || "");
    setEditedTag(proj.tag || "JavaScript");
    setEditedVisibility(proj.visibility || "public");
    setEditedGithubLink(proj.githubLink || "");
    setEditedVideoLink(proj.videoLink || "");
    setEditedImageUrl(proj.imageUrl || "");
    setEditedImageFile(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!editedTitle.trim() || !editedDescription.trim()) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      let imageUrl = editedImageUrl;

      if (editedImageFile) {
        imageUrl = await uploadToCloudinary(editedImageFile);
      }

      const ref = doc(db, "projects", editingProject.id);
      await updateDoc(ref, {
        title: editedTitle,
        description: editedDescription,
        tag: editedTag,
        visibility: editedVisibility,
        githubLink: editedGithubLink.trim() || null,
        videoLink: editedVideoLink.trim() || null,
        imageUrl: imageUrl || null,
      });

      setProjects((ps) =>
        ps.map((p) =>
          p.id === editingProject.id
            ? {
                ...p,
                title: editedTitle,
                description: editedDescription,
                tag: editedTag,
                visibility: editedVisibility,
                githubLink: editedGithubLink,
                videoLink: editedVideoLink,
                imageUrl: imageUrl,
              }
            : p
        )
      );

      setEditingProject(null);
    } catch (e) {
      console.error(e);
      setError("Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="mi-loading-container">
        <div className="loader"></div>
        <p className="mi-loading-text">Cargando proyectos...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Tus Proyectos</h1>
        {user && (
          <p className="subtext">
            📙 Bienvenid@ <span>{user.email}</span>
          </p>
        )}
        <div className="separator" />
      </div>

      <button className="btn-new" onClick={() => navigate("/profile/new")}>
        + Nuevo Proyecto
      </button>

      {projects.length === 0 ? (
        <p className="no-projects">No tienes proyectos aún.</p>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
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
            {error && <p className="error-text">{error}</p>}

            <label>Título:</label>
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              required
            />

            <label>Descripción:</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              required
            />

            <label>Etiqueta:</label>
            <select
              value={editedTag}
              onChange={(e) => setEditedTag(e.target.value)}
            >
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="CSS">CSS</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Firebase">Firebase</option>
              <option value="SQL">SQL</option>
            </select>

            <label>Visibilidad:</label>
            <select
              value={editedVisibility}
              onChange={(e) => setEditedVisibility(e.target.value)}
            >
              <option value="public">Público</option>
              <option value="private">Privado</option>
            </select>

            <label>Link de GitHub:</label>
            <input
              type="url"
              value={editedGithubLink}
              onChange={(e) => setEditedGithubLink(e.target.value)}
              placeholder="https://github.com/usuario/proyecto"
            />

            <label>Link de Video:</label>
            <input
              type="url"
              value={editedVideoLink}
              onChange={(e) => setEditedVideoLink(e.target.value)}
              placeholder="https://youtube.com/..."
            />

            <label>Imagen destacada:</label>
            {editedImageUrl && (
              <img
                src={editedImageUrl}
                alt="Imagen destacada"
                style={{
                  width: "100%",
                  maxHeight: "150px",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setEditedImageFile(e.target.files[0]);
                  setEditedImageUrl(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />

            <button onClick={handleSave} className="btn-save" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              onClick={() => setEditingProject(null)}
              className="btn-cancel"
              disabled={saving}
            >
              Cancelar
            </button>
          </div>
        </>
      )}

      {/* Botón para ir a /todoslosproyectos */}
      <button
        onClick={() => navigate("/todoslosproyectos")}
        className="btn-new"
        style={{ marginBottom: "1rem" }}
      >
        Explorar proyectos
      </button>

      {/* Nuevo botón para ir a /profile/view */}
      <button
        onClick={() => navigate("/profile/view")}
        className="btn-new"
        style={{ marginBottom: "1rem" }}
      >
        Ver perfil detallado
      </button>

      <button onClick={handleLogout} className="btn-new">
        Cerrar sesión
      </button>
    </div>
  );
};

export default Profile;
