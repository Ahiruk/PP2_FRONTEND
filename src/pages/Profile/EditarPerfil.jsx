import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import "./EditarPerfil.css";

export default function EditarPerfil() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docSnap = await getDoc(doc(db, "usuarios", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setBio(data.bio || "");
        setPreview(data.photoURL || "");
      }
    };
    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
      method: "POST",
      body: data,
    });
    const json = await res.json();
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const uid = auth.currentUser.uid;
      let photoURL = preview;
      if (photo) {
        photoURL = await uploadToCloudinary(photo);
      }

      await updateDoc(doc(db, "usuarios", uid), {
        name,
        bio,
        photoURL,
      });

      setMensaje("Perfil actualizado con éxito");
      setTimeout(() => navigate("/profile/view"), 1500);
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setMensaje("Error al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <h2>Editar Perfil</h2>

        {mensaje && <p className="feedback-message">{mensaje}</p>}

        <label>Nombre completo</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Biografía</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="3" />

        <label>Foto de perfil</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Vista previa" className="profile-preview" />}

        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
