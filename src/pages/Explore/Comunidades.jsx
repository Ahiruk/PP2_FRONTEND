import { useEffect, useState } from "react";
import "./Comunidades.css";
import { db } from "../../services/firebase";
import { collection, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";

const Comunidades = () => {
  const [comunidades, setComunidades] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "comunidades"), (snapshot) => {
      const data = {};
      snapshot.forEach((doc) => {
        const comunidad = doc.data();
        data[comunidad.nombre] = {
          id: doc.id,
          descripcion: comunidad.descripcion,
          mensajes: comunidad.mensajes || [],
          seguidores: comunidad.seguidores || [],
        };
      });

      setComunidades(data);

      // Solo cambiar activeTab si no hay ninguno o el actual no existe ya
      if (!activeTab || !(activeTab in data)) {
        setActiveTab(Object.keys(data)[0] || "");
      }
    });

    return () => unsubscribe();
  }, [activeTab]); // Agregamos activeTab para poder leerlo dentro del efecto

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !user || !activeTab) return;

    const comunidadActual = comunidades[activeTab];
    const nuevo = {
      autor: user.email,
      contenido: nuevoMensaje.trim(),
      timestamp: new Date().toISOString(),
      likes: [],
    };

    try {
      await updateDoc(doc(db, "comunidades", comunidadActual.id), {
        mensajes: [...comunidadActual.mensajes, nuevo],
      });

      setNuevoMensaje("");
    } catch (error) {
      alert("Error al enviar mensaje: " + error.message);
    }
  };

  const toggleLike = async (index) => {
    if (!user || !activeTab) return;

    const comunidadActual = comunidades[activeTab];
    const mensajes = comunidadActual.mensajes.map((m, i) => {
      if (i === index) {
        const alreadyLiked = m.likes?.includes(user.email);
        return {
          ...m,
          likes: alreadyLiked
            ? m.likes.filter((email) => email !== user.email)
            : [...(m.likes || []), user.email],
        };
      }
      return m;
    });

    try {
      await updateDoc(doc(db, "comunidades", comunidadActual.id), {
        mensajes,
      });
    } catch (error) {
      alert("Error al dar like: " + error.message);
    }
  };

  const toggleSeguir = async () => {
    if (!user || !activeTab) return;

    const comunidadDocRef = doc(db, "comunidades", comunidades[activeTab].id);
    const seguidores = comunidades[activeTab].seguidores || [];
    const yaSigue = seguidores.includes(user.email);

    try {
      await updateDoc(comunidadDocRef, {
        seguidores: yaSigue ? arrayRemove(user.email) : arrayUnion(user.email),
      });
    } catch (error) {
      alert("Error al seguir comunidad: " + error.message);
    }
  };

  return (
    <div className="comunidades-container">
      <h1>Comunidades</h1>

      {/* Tabs */}
      <div className="tabs">
        {Object.keys(comunidades).map((tab) => (
          <button
            key={tab}
            className={tab === activeTab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Foro */}
      {activeTab && comunidades[activeTab] && (
        <div className="foro">
          <h2>{activeTab}</h2>
          <p className="descripcion">{comunidades[activeTab].descripcion}</p>

          {/* Seguir comunidad */}
          {user && (
            <button onClick={toggleSeguir} className="seguir-btn">
              {comunidades[activeTab].seguidores?.includes(user.email)
                ? "Dejar de seguir"
                : "Seguir comunidad"}
            </button>
          )}
          <p className="seguidores">
            Seguidores: {comunidades[activeTab].seguidores?.length || 0}
          </p>

          {/* Mensajes */}
          <div className="mensajes">
            {comunidades[activeTab].mensajes.length > 0 ? (
              comunidades[activeTab].mensajes.map((m, i) => (
                <div key={i} className="mensaje">
                  <strong>{m.autor}</strong>: {m.contenido}
                  <div className="like-seccion">
                    {user && (
                      <button onClick={() => toggleLike(i)}>
                        {m.likes?.includes(user.email) ? "💙" : "🤍"} {m.likes?.length || 0}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="sin-mensajes">Aún no hay mensajes.</p>
            )}
          </div>

          {/* Área para comentar (solo si está logueado) */}
          {user ? (
            <>
              <textarea
                rows={3}
                placeholder="Escribe tu mensaje…"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
              />
              <button onClick={enviarMensaje}>Publicar</button>
            </>
          ) : (
            <p className="aviso-login">Inicia sesión para comentar en esta comunidad.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Comunidades;
