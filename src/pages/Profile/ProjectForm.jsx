import { useState } from "react";
import { db } from "../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./ProjectForm.css";

const ProjectForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("JavaScript");
  const [visibility, setVisibility] = useState("public");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // <-- nuevo estado para preview
  const [githubLink, setGithubLink] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    if (!json.secure_url) throw new Error("Error al subir imagen a Cloudinary");
    return json.secure_url;
  };

  // Validación simple de URL (puede mejorar si quieres)
  const isValidURL = (str) => {
    if (!str) return true; // vacío está permitido
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file)); // <-- creamos preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !tag) {
      setError("Todos los campos obligatorios excepto los links.");
      return;
    }

    if (!isValidURL(githubLink)) {
      setError("Por favor ingresa un link de GitHub válido.");
      return;
    }

    if (!isValidURL(videoLink)) {
      setError("Por favor ingresa un link de video válido.");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      await addDoc(collection(db, "projects"), {
        title,
        description,
        tag,
        imageUrl,
        visibility,
        githubLink: githubLink.trim() || null,
        videoLink: videoLink.trim() || null,
        uid: user.uid,
        authorName: user.email,
        createdAt: serverTimestamp(),
      });

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Error al guardar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToProfile = () => {
    navigate("/profile");
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      {error && <p className="error-text">{error}</p>}

      <div className="form-group">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción breve</label>
        <textarea
          id="description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="tag">Etiqueta</label>
        <select
          id="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          required
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
      </div>

      <div className="form-group">
        <label htmlFor="image">Imagen destacada</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange} // <-- usamos función con preview
        />
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="Preview imagen seleccionada"
            style={{ width: "100%", maxHeight: "150px", marginTop: "10px", objectFit: "cover" }}
          />
        )}
      </div>

      <div className="form-group">
        <label htmlFor="visibility">Visibilidad</label>
        <select
          id="visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          required
        >
          <option value="public">Público</option>
          <option value="private">Privado</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="githubLink">Link de GitHub</label>
        <input
          id="githubLink"
          type="url"
          placeholder="https://github.com/usuario/proyecto"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="videoLink">Link de Video</label>
        <input
          id="videoLink"
          type="url"
          placeholder="https://youtube.com/..."
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Proyecto"}
        </button>

        <button
          type="button"
          onClick={handleBackToProfile}
          className="btn btn-secondary"
        >
          Volver a mis proyectos
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
