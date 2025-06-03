// src/pages/Explore/TodosLosProyectos.jsx
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../services/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./TodosProyectos.css";

const TodosLosProyectos = () => {
  const [projects, setProjects] = useState([]);
  const [tagsArray, setTagsArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [comment, setComment] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const publics = all.filter(p => !p.deleted && p.visibility === "public");
      setProjects(publics);

      const tagSet = new Set();
      publics.forEach(p => {
        if (Array.isArray(p.tags)) p.tags.forEach(t => tagSet.add(t));
        ["type", "technology", "theme"].forEach(f => {
          if (p[f] && typeof p[f] === "string") tagSet.add(p[f]);
        });
      });
      setTagsArray(Array.from(tagSet).sort());
      setLoading(false);
    });

    return () => unsub();
  }, []);

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

  const toggleField = async (proj, field) => {
    if (!user) return alert("Debes iniciar sesión.");
    await updateDoc(doc(db, "projects", proj.id), {
      [field]: proj[field]?.includes(user.uid)
        ? arrayRemove(user.uid)
        : arrayUnion(user.uid),
    });
    await logActivity(
      field === "likes" ? "like" : "favorito",
      proj.id,
      { title: proj.title }
    );
  };

  const addComment = async proj => {
    if (!user) return alert("Debes iniciar sesión.");
    if (!comment.trim()) return;
    const newCom = {
      userId: user.uid,
      userEmail: user.email,
      text: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    await updateDoc(doc(db, "projects", proj.id), {
      comments: arrayUnion(newCom),
    });
    await logActivity("comentar", proj.id, { title: proj.title });
    setComment("");
  };

  const q = search.toLowerCase();
  const visible = projects.filter(p => {
    const title = (p.title || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const tagsS = Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase() : "";
    const matchText = title.includes(q) || desc.includes(q) || tagsS.includes(q);
    const matchCat = category === "Todas" ||
      (Array.isArray(p.tags) && p.tags.includes(category)) ||
      p.type === category ||
      p.technology === category ||
      p.theme === category;
    return matchText && matchCat;
  });

  if (loading)
    return (
      <div className="loading-container">
        <div className="loader" />
        <p className="loading-text">Cargando todos los proyectos…</p>
      </div>
    );

  return (
    <div className="todos-container">
      <section className="hero">
        <h1>Mi OpenLab</h1>
        <p>Explora proyectos públicos o comparte los tuyos con la comunidad.</p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate("/register")}>Regístrate</button>
        </div>
        <button className="login-link" onClick={() => navigate("/login")}>Iniciar sesión</button>
      </section>

      <div className="search-bar">
        <input
          type="search"
          placeholder="Buscar por título, descripción o etiquetas…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-bar">
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="Todas">Todas las categorías</option>
          {tagsArray.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <section id="lista-proyectos">
        <h2 className="todos-title">Proyectos públicos</h2>
        {visible.length === 0 && <p>No hay proyectos que coincidan.</p>}

        <div className="todos-grid">
          {visible.map(p => {
            const liked = user && p.likes?.includes(user.uid);
            const fav = user && p.favorites?.includes(user.uid);
            const open = openId === p.id;

            return (
              <div key={p.id} className="todos-card">
                {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="card-img" />}
                <h3>{p.title}</h3>
                <p className="autor">Autor: {p.authorName || "Anónimo"}</p>

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
                    ⭐ {p.favorites?.length || 0}
                  </button>
                  <button title="Comentarios" onClick={() => setOpenId(open ? null : p.id)}>
                    💬 {p.comments?.length || 0}
                  </button>
                </div>

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

                <Link to={`/proyecto/${p.id}`} className="mas-info">Más información</Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TodosLosProyectos;
