// src/pages/PerfilProfesional.jsx

import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import "./PerfilProfesional.css";

const PerfilProfesional = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    educacion: [""],
    experiencia: [""],
    habilidades: [""],
    tecnologias: [""],
    linkedin: "",
    github: "",
    twitter: "",
  });

  useEffect(() => {
    const cargarPerfilExistente = async () => {
      try {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const datos = snap.data();
          setFormData({
            educacion: datos.educacion || [""],
            experiencia: datos.experiencia || [""],
            habilidades: datos.habilidades || [""],
            tecnologias: datos.tecnologias || [""],
            linkedin: datos.linkedin || "",
            github: datos.github || "",
            twitter: datos.twitter || "",
          });
        }
      } catch (err) {
        console.error("Error al cargar datos existentes:", err);
      }
    };
  
    if (user?.uid) {
      cargarPerfilExistente();
    }
  }, [user]);
  

  const handleChange = (e, field, index = null) => {
    if (index !== null) {
      const updatedArray = [...formData[field]];
      updatedArray[index] = e.target.value;
      setFormData({ ...formData, [field]: updatedArray });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "usuarios", user.uid), formData, { merge: true });
      alert("Perfil guardado exitosamente");
    } catch (error) {
      console.error("Error al guardar perfil:", error);
    }
  };

  return (
    <div className="perfil-container">
      <h2>Formulario de Portafolio Profesional</h2>
      <form onSubmit={handleSubmit}>

        <label>Educación:</label>
        {formData.educacion.map((edu, i) => (
          <input
            key={i}
            type="text"
            value={edu}
            onChange={(e) => handleChange(e, "educacion", i)}
            placeholder="Ej: Universidad del Norte - Ingeniería"
          />
        ))}
        <button type="button" onClick={() => addField("educacion")}>
          + Añadir educación
        </button>

        <label>Experiencia:</label>
        {formData.experiencia.map((exp, i) => (
          <input
            key={i}
            type="text"
            value={exp}
            onChange={(e) => handleChange(e, "experiencia", i)}
            placeholder="Ej: Desarrollador en XYZ"
          />
        ))}
        <button type="button" onClick={() => addField("experiencia")}>
          + Añadir experiencia
        </button>

        <label>Habilidades:</label>
        {formData.habilidades.map((hab, i) => (
          <input
            key={i}
            type="text"
            value={hab}
            onChange={(e) => handleChange(e, "habilidades", i)}
            placeholder="Ej: Comunicación, liderazgo"
          />
        ))}
        <button type="button" onClick={() => addField("habilidades")}>
          + Añadir habilidad
        </button>

        <label>Tecnologías dominadas:</label>
        {formData.tecnologias.map((tech, i) => (
          <input
            key={i}
            type="text"
            value={tech}
            onChange={(e) => handleChange(e, "tecnologias", i)}
            placeholder="Ej: React, Firebase"
          />
        ))}
        <button type="button" onClick={() => addField("tecnologias")}>
          + Añadir tecnología
        </button>

        <label>LinkedIn:</label>
        <input
          type="text"
          value={formData.linkedin}
          onChange={(e) => handleChange(e, "linkedin")}
          placeholder="https://linkedin.com/in/tu_usuario"
        />

        <label>GitHub:</label>
        <input
          type="text"
          value={formData.github}
          onChange={(e) => handleChange(e, "github")}
          placeholder="https://github.com/tu_usuario"
        />

        <label>Twitter:</label>
        <input
          type="text"
          value={formData.twitter}
          onChange={(e) => handleChange(e, "twitter")}
          placeholder="https://twitter.com/tu_usuario"
        />

        <button type="submit">Guardar Perfil</button>
      </form>
    </div>
  );
};

export default PerfilProfesional;
