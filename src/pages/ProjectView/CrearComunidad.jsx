// src/pages/Comunidades/CrearComunidad.jsx
import { useState } from "react";
import { db } from "../../services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const CrearComunidad = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión.");

    if (!nombre.trim()) return alert("El nombre es obligatorio");

    try {
      await addDoc(collection(db, "comunidades"), {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        creador: user.email,
        creadoEn: serverTimestamp(),
        mensajes: [],
      });
      alert("Comunidad creada con éxito");
      navigate("/comunidades");
    } catch (error) {
      alert("Error al crear comunidad: " + error.message);
    }
  };

  return (
    <div className="crear-comunidad-container">
      <h1>Crear nueva comunidad</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de la comunidad (ej: Backend)"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <textarea
          rows={3}
          placeholder="Descripción de la comunidad (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button type="submit">Crear comunidad</button>
      </form>
    </div>
  );
};

export default CrearComunidad;
