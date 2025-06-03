import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  onSnapshot
} from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("perfil");
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [editedPhoto, setEditedPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editedProject, setEditedProject] = useState({});
  const [likesCount, setLikesCount] = useState(0);
  const [lastActivity, setLastActivity] = useState(null);
  const [userLogs, setUserLogs] = useState([]);

  const navigate = useNavigate();

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsub = onSnapshot(collection(db, "projects"), async (snap) => {
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        setEditedName(data.name || "");
        setEditedBio(data.bio || "");
        setPreviewPhoto(data.photoURL);
      }

      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const filtered = all.filter(p => p.uid === user.uid && (!p.deleted || p.deleted === false));
      const favProjects = all.filter(p => Array.isArray(p.favorites) && p.favorites.includes(user.uid));

      let totalLikes = 0;
      let latest = null;

      filtered.forEach(proj => {
        if (Array.isArray(proj.likes)) {
          totalLikes += proj.likes.length;
        }
        if (!latest || new Date(proj.createdAt) > new Date(latest)) {
          latest = proj.createdAt;
        }
      });

      setUserProjects(filtered);
      setFavoriteProjects(favProjects);
      setLikesCount(totalLikes);
      setLastActivity(latest);

      const logQuery = query(
        collection(db, "logs"),
        where("userId", "==", user.uid)
      );
      const logSnap = await getDocs(logQuery);
      const logs = logSnap.docs
        .map(d => d.data())
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setUserLogs(logs);

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const logActivity = async (type, projectId, details = {}) => {
    const user = auth.currentUser;
    if (!user) return;
    await addDoc(collection(db, "logs"), {
      userId: user.uid,
      userEmail: user.email,
      type,
      projectId,
      timestamp: new Date().toISOString(),
      ...details,
    });
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    let photoURL = userData.photoURL;
    if (editedPhoto) {
      photoURL = await uploadToCloudinary(editedPhoto);
    }

    const docRef = doc(db, "usuarios", user.uid);
    await updateDoc(docRef, {
      name: editedName,
      bio: editedBio,
      photoURL,
    });

    setUserData({ ...userData, name: editedName, bio: editedBio, photoURL });
    setEditing(false);
  };

  const handleEditProject = (project) => {
    setEditingProject(project.id);
    setEditedProject(project);
  };

  const handleProjectChange = (field, value) => {
    setEditedProject(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProject = async () => {
    const { id, ...updates } = editedProject;
    const ref = doc(db, "projects", id);
    await updateDoc(ref, updates);
    await logActivity("editar", id);
    setUserProjects(prev => prev.map(p => (p.id === id ? editedProject : p)));
    setEditingProject(null);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("¿Eliminar este proyecto?")) return;
    const ref = doc(db, "projects", id);
    await updateDoc(ref, { deleted: true });
    await logActivity("eliminar", id);
    setUserProjects(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <div className="user-profile-loading">Cargando perfil...</div>;
  if (!userData) return <div className="user-profile-error">No se encontraron datos del usuario.</div>;

  return (
    <div className="user-dashboard responsive-layout">
      <div className="sidebar">
        <div className="avatar-mini">
          <img src={userData.photoURL} alt="Avatar" />
        </div>
        <ul>
          <li onClick={() => setActiveTab("perfil")} className={activeTab === "perfil" ? "active" : ""}>Mi perfil</li>
          <li onClick={() => setActiveTab("proyectos")} className={activeTab === "proyectos" ? "active" : ""}>Mis proyectos</li>
          <li onClick={() => setActiveTab("favoritos")}  className={activeTab === "favoritos" ? "active" : ""}>Favoritos</li>
          <li onClick={() => setActiveTab("actividad")} className={activeTab === "actividad" ? "active" : ""}>Actividad</li>

        </ul>
      </div>

      <div className="dashboard-content">
      {activeTab === "favoritos" && (
          <>
            <h2 className="dashboard-title">Proyectos Favoritos</h2>
            <div className="projects-list">
              {favoriteProjects.length === 0 ? (
                <p>No has marcado proyectos como favoritos aún.</p>
              ) : (
                favoriteProjects.map((project) => (
                  <div key={project.id} className="project-card">
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                    <p><strong>Autor:</strong> {project.authorName || "Anónimo"}</p>
                    <a href={`/proyecto/${project.id}`}>Ver más</a>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        {activeTab === "perfil" && (
          <>
            <h2 className="dashboard-title">Mi perfil</h2>
            <div className="profile-card">
              <div className="profile-img-container">
                <img src={previewPhoto} alt="Foto de perfil" className="profile-img editable" />
                {editing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setEditedPhoto(e.target.files[0]);
                      setPreviewPhoto(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                )}
              </div>
              <div className="profile-info">
                {editing ? (
                  <>
                    <label>Nombre:</label>
                    <input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                    <label>Bio:</label>
                    <textarea value={editedBio} onChange={(e) => setEditedBio(e.target.value)} />
                    <button className="edit-btn" onClick={handleSaveProfile}>Guardar</button>
                    <button className="edit-btn" onClick={() => setEditing(false)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <p><strong>Nombre:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Bio:</strong> {userData.bio || "No definida."}</p>
                    <p><strong>Último acceso:</strong> {new Date().toLocaleString()}</p>
                    <p><strong>Total de proyectos:</strong> {userProjects.length}</p>
                    <p><strong>Total de likes recibidos:</strong> {likesCount}</p>
                    <p><strong>Última actividad:</strong> {lastActivity ? new Date(lastActivity).toLocaleString() : "No disponible"}</p>
                    <button className="edit-btn" onClick={() => setEditing(true)}>Editar</button>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "proyectos" && (
          <>
            <div className="proyectos-header">
              <h2 className="dashboard-title">Mis proyectos</h2>
              <button className="btn-new" onClick={() => navigate("/profile/new")}>+ Nuevo Proyecto</button>
            </div>
            <div className="projects-list">
              {userProjects.length === 0 ? (
                <p>No tienes proyectos aún.</p>
              ) : (
                userProjects.map((project) => (
                  <div key={project.id} className="project-card">
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                    <div className="project-actions">
                      <button onClick={() => handleEditProject(project)}>Editar</button>
                      <button className="delete" onClick={() => handleDeleteProject(project.id)}>Eliminar</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {editingProject && (
              <>
                <div className="modal-backdrop" />
                <div className="edit-form">
                  <h3>Editar Proyecto</h3>

                  <label>Título:</label>
                  <input value={editedProject.title || ""} onChange={(e) => handleProjectChange("title", e.target.value)} />

                  <label>Descripción:</label>
                  <textarea value={editedProject.description || ""} onChange={(e) => handleProjectChange("description", e.target.value)} />

                  <label>Etiqueta:</label>
                  <select value={editedProject.tag || ""} onChange={(e) => handleProjectChange("tag", e.target.value)}>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                  </select>

                  <label>Visibilidad:</label>
                  <select value={editedProject.visibility || "public"} onChange={(e) => handleProjectChange("visibility", e.target.value)}>
                    <option value="public">Público</option>
                    <option value="private">Privado</option>
                  </select>

                  <label>Link de GitHub:</label>
                  <input value={editedProject.githubLink || ""} onChange={(e) => handleProjectChange("githubLink", e.target.value)} />

                  <label>Link de Video:</label>
                  <input value={editedProject.videoLink || ""} onChange={(e) => handleProjectChange("videoLink", e.target.value)} />

                  <button className="btn-save" onClick={handleSaveProject}>Guardar</button>
                  <button className="btn-cancel" onClick={() => setEditingProject(null)}>Cancelar</button>
                </div>
              </>
            )}
          </>
        )}
        {activeTab === "actividad" && (
  <>
    <h2 className="dashboard-title">Actividad reciente</h2>
    <div className="activity-timeline">
      {userLogs.length === 0 ? (
        <p>No hay registros de actividad.</p>
      ) : (
        <ul>
          {userLogs.map((log, index) => (
            <li key={index} className="timeline-entry">
              <span className="timestamp">
                {new Date(log.timestamp).toLocaleString()}
              </span>
              <span className="action">
                <strong>{log.type.toUpperCase()}</strong>
                {log.title && ` - ${log.title}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </>
)}

      </div>
    </div>
  );
}
