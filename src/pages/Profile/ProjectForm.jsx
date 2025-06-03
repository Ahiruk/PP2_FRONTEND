// src/pages/Profile/ProjectForm.jsx
import { useState } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./ProjectForm.css";

const TAG_OPTIONS = ["JavaScript", "Python", "React", "Node.js", "CSS", "TypeScript", "Firebase", "SQL", "C++", "Java", "PHP", "Ruby", "Django", "Flask", "Express.js", "Next.js", "Angular", "Vue.js", "HTML"];
const TYPE_OPTIONS = ["Web", "Móvil", "Web/Móvil", "Otro"];
const TECH_OPTIONS = ["React", "No sabe"];
const THEME_OPTIONS = ["Educación", "Salud", "Finanzas", "Material Uninorte"];

const ProjectForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [type, setType] = useState(TYPE_OPTIONS[0]);
  const [technology, setTechnology] = useState(TECH_OPTIONS[0]);
  const [theme, setTheme] = useState(THEME_OPTIONS[0]);
  const [visibility, setVisibility] = useState("public");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

  const uploadToCloudinary = async file => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: data });
    const json = await res.json();
    if (!json.secure_url) throw new Error("Error al subir imagen a Cloudinary");
    return json.secure_url;
  };

  const isValidURL = str => {
    if (!str) return true;
    try { new URL(str); return true; } catch { return false; }
  };

  const handleImageChange = e => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const toggleTag = t =>
    setTags(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const logActivity = async (type, projectId, details = {}) => {
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

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || tags.length === 0) {
      setError("Título, descripción y al menos una etiqueta son obligatorios.");
      return;
    }
    if (!isValidURL(githubLink) || !isValidURL(videoLink)) {
      setError("Revisa los links de GitHub o video.");
      return;
    }

    try {
      setLoading(true);
      const imageUrl = imageFile ? await uploadToCloudinary(imageFile) : "";

      const docRef = await addDoc(collection(db, "projects"), {
        title,
        description,
        tags,
        type,
        technology,
        theme,
        imageUrl,
        visibility,
        githubLink: githubLink.trim() || null,
        videoLink: videoLink.trim() || null,
        uid: user.uid,
        authorName: user.email,
        createdAt: serverTimestamp(),
      });

      await logActivity("crear", docRef.id, { title });
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Error al guardar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      {error && <p className="error-text">{error}</p>}

      <div className="form-group">
        <label htmlFor="title">Título*</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción breve*</label>
        <textarea id="description" rows="4" value={description}
          onChange={e => setDescription(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Etiquetas*</label>
        <div className="tags-wrapper">
          {TAG_OPTIONS.map(t => (
            <label key={t} className="tag-chip">
              <input type="checkbox" checked={tags.includes(t)}
                onChange={() => toggleTag(t)} />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div className="form-row4">
        <div className="form-group">
          <label>Tipo</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            {TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Tecnología</label>
          <select value={technology} onChange={e => setTechnology(e.target.value)}>
            {TECH_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Tema</label>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            {THEME_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Visibilidad</label>
          <select value={visibility} onChange={e => setVisibility(e.target.value)}>
            <option value="public">Público</option>
            <option value="private">Privado</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Imagen destacada</label>
        <div className="image-uploader" onClick={() => document.getElementById("image-input").click()}>
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="preview" className="image-preview" />
              <span className="change-text">Cambiar imagen</span>
            </>
          ) : (
            <div className="placeholder">
              <span>📷</span>
              <p>Haz clic para agregar la imagen</p>
            </div>
          )}
        </div>
        <input
          id="image-input"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="github">Link de GitHub</label>
        <input
          id="github"
          type="url"
          placeholder="https://github.com/…"
          value={githubLink}
          onChange={e => setGithubLink(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="video">Link de Video</label>
        <input
          id="video"
          type="url"
          placeholder="https://youtube.com/…"
          value={videoLink}
          onChange={e => setVideoLink(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando…" : "Guardar Proyecto"}
        </button>
        <button type="button" onClick={() => navigate("/profile")}
          className="btn btn-secondary">
          Volver a mis proyectos
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
