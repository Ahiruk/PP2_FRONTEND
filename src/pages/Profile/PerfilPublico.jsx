// src/pages/PerfilPublico.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./PerfilProfesional.css";

const PerfilPublico = () => {
  const { uid } = useParams();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const docRef = doc(db, "perfilesProfesionales", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPerfil(docSnap.data());
        } else {
          console.log("No se encontró perfil");
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    };

    fetchPerfil();
  }, [uid]);

  if (!perfil) return <p>Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <h2>{perfil.nombre}</h2>
      <p>{perfil.biografia}</p>

      <h3>🎓 Educación</h3>
      <ul>
        {perfil.educacion.map((edu, i) => (
          <li key={i}>{edu}</li>
        ))}
      </ul>

      <h3>💼 Experiencia</h3>
      <ul>
        {perfil.experiencia.map((exp, i) => (
          <li key={i}>{exp}</li>
        ))}
      </ul>

      <h3>🧠 Habilidades</h3>
      <ul>
        {perfil.habilidades.map((hab, i) => (
          <li key={i}>{hab}</li>
        ))}
      </ul>

      <h3>🛠️ Tecnologías dominadas</h3>
      <ul>
        {perfil.tecnologias.map((tech, i) => (
          <li key={i}>{tech}</li>
        ))}
      </ul>

      <h3>🔗 Redes sociales</h3>
      <ul>
        {perfil.linkedin && (
          <li>
            <a href={perfil.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </li>
        )}
        {perfil.github && (
          <li>
            <a href={perfil.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          </li>
        )}
        {perfil.twitter && (
          <li>
            <a href={perfil.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default PerfilPublico;
