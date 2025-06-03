import { useEffect, useState } from "react";
import {
  collection, getDocs, doc, updateDoc,
  arrayUnion, arrayRemove
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";          // 👈  tu hook de sesión
import "./TodosProyectos.css";

const TodosLosProyectos = () => {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [openId,   setOpenId]   = useState(null);       // tarjeta con comentarios abiertos
  const [comment,  setComment]  = useState("");
  const { user }                = useAuth();
  const navigate                = useNavigate();

  /* -------- Traer proyectos públicos -------- */
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "projects"));
        const all  = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setProjects(all.filter(p => !p.deleted && p.visibility === "public"));
      } catch (e) { console.error("❌ Error al obtener proyectos:", e); }
      finally   { setLoading(false); }
    })();
  }, []);

  /* -------- Helpers de Firestore (like, fav, comment) -------- */
  const toggleField = async (proj, field) => {
    if (!user) return alert("Debes iniciar sesión.");
    const ref   = doc(db, "projects", proj.id);
    const hasIt = proj[field]?.includes(user.uid);

    await updateDoc(ref, {
      [field]: hasIt ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
    setProjects(prev => prev.map(p =>
      p.id === proj.id
        ? {
            ...p,
            [field]: hasIt
              ? p[field].filter(uid => uid !== user.uid)
              : [...(p[field] || []), user.uid],
          }
        : p
    ));
  };

  const addComment = async proj => {
    if (!user) return alert("Debes iniciar sesión.");
    if (!comment.trim()) return;

    const ref = doc(db, "projects", proj.id);
    const newCom = {
      userId: user.uid,
      userEmail: user.email,
      text: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    await updateDoc(ref, { comments: arrayUnion(newCom) });
    setProjects(prev => prev.map(p =>
      p.id === proj.id ? { ...p, comments: [...(p.comments || []), newCom] } : p
    ));
    setComment("");
  };

  /* -------- Loader -------- */
  if (loading)
    return (
      <div className="loading-container">
        <div className="loader" />
        <p className="loading-text">Cargando todos los proyectos…</p>
      </div>
    );

  return (
    <div className="todos-container">
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <h1>Mi OpenLab</h1>
        <p>Explora proyectos públicos o comparte los tuyos con la comunidad.</p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Regístrate
          </button>
        </div>

        <button className="login-link" onClick={() => navigate("/login")}>
          Iniciar sesión
        </button>
      </section>

      {/* ---------- LISTA DE PROYECTOS ---------- */}
      <section id="lista-proyectos">
        <h2 className="todos-title">Proyectos públicos</h2>

        {projects.length === 0 && <p>No hay proyectos disponibles.</p>}

        <div className="todos-grid">
          {projects.map(p => {
            const liked = user && p.likes?.includes(user.uid);
            const fav   = user && p.favorites?.includes(user.uid);
            const open  = openId === p.id;

            return (
              <div key={p.id} className="todos-card">
                {/* Miniatura */}
                {p.imageUrl && (
                  <img src={p.imageUrl} alt={p.title} className="card-img" />
                )}

                <h3>{p.title}</h3>
                <p className="autor">Autor: {p.authorName || "Anónimo"}</p>

                {/* Acciones */}
                <div className="card-actions">
                  <button
                    title="Like"
                    onClick={() => toggleField(p, "likes")}
                    style={{ color: liked ? "red" : "gray" }}>
                    ❤️ {p.likes?.length || 0}
                  </button>

                  <button
                    title="Favorito"
                    onClick={() => toggleField(p, "favorites")}
                    style={{ color: fav ? "gold" : "gray" }}>
                    ⭐
                  </button>

                  <button
                    title="Comentarios"
                    onClick={() => setOpenId(open ? null : p.id)}>
                    💬 {p.comments?.length || 0}
                  </button>
                </div>

                {/* Panel de comentarios inline */}
                {open && (
                  <div className="card-comments">
                    <ul>
                      {(p.comments || []).map((c, i) => (
                        <li key={i}><b>{c.userEmail}</b>: {c.text}</li>
                      ))}
                    </ul>
                    {user && (
                      <>
                        <textarea
                          rows="2"
                          value={comment}
                          placeholder="Escribe un comentario…"
                          onChange={e => setComment(e.target.value)}
                        />
                        <button onClick={() => addComment(p)}>Enviar</button>
                      </>
                    )}
                  </div>
                )}

                {/* Enlace detalle */}
                <Link to={`/proyecto/${p.id}`} className="mas-info">
                  Más información
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TodosLosProyectos;
