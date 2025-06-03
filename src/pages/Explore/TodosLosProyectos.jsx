import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../services/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserCheck } from "lucide-react";
import "./TodosProyectos.css";

const TodosLosProyectos = () => {
  const [projects, setProjects] = useState([]);
  const [tagsArray, setTagsArray] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [comment, setComment] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [following, setFollowing] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [logros, setLogros] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), async (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const publics = all.filter((p) => !p.deleted && p.visibility === "public");

      let userFollowing = [];
      if (user) {
        const userDoc = await getDoc(doc(db, "usuarios", user.uid));
        userFollowing = userDoc.exists() ? userDoc.data().siguiendo || [] : [];
        setFollowing(userFollowing);
      }

      const sorted = [...publics].sort((a, b) => {
        const aFollow = user && userFollowing.includes(a.uid);
        const bFollow = user && userFollowing.includes(b.uid);
        if (aFollow && !bFollow) return -1;
        if (!aFollow && bFollow) return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });

      setProjects(sorted);

      const tagSet = new Set();
      publics.forEach((p) => {
        if (Array.isArray(p.tags)) p.tags.forEach((t) => tagSet.add(t));
        ["type", "technology", "theme"].forEach((f) => {
          if (p[f] && typeof p[f] === "string") tagSet.add(p[f]);
        });
      });
      setTagsArray(Array.from(tagSet).sort());
    });

    const unsubUsers = onSnapshot(collection(db, "usuarios"), (snap) => {
      const data = {};
      const logrosTemp = {};
      snap.docs.forEach((d) => {
        const u = d.data();
        data[d.id] = u;
        const userProjs = projects.filter((p) => p.uid === d.id);
        const likes = userProjs.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
        const comments = userProjs.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
        const logrosUser = [];
        if (userProjs.length > 0) logrosUser.push("\u{1F389} Primer Proyecto");
        if ((u.seguidores?.length || 0) >= 10) logrosUser.push("\u{1F465} 10 Seguidores");
        if (likes >= 10) logrosUser.push("\u{1F525} Proyecto Popular");
        if (comments >= 5) logrosUser.push("\u{1F4AC} Muy comentado");
        logrosTemp[d.id] = logrosUser;
      });
      setUsuarios(data);
      setLogros(logrosTemp);
    });

    return () => {
      unsubProjects();
      unsubUsers();
    };
  }, [user, projects]);

  const toggleField = async (proj, field) => {
    if (!user) return alert("Debes iniciar sesión.");
    await updateDoc(doc(db, "projects", proj.id), {
      [field]: proj[field]?.includes(user.uid)
        ? arrayRemove(user.uid)
        : arrayUnion(user.uid),
    });
  };

  const addComment = async (proj) => {
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
    setComment("");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      alert("Error al cerrar sesión: " + error.message);
    }
  };

  const q = search.toLowerCase();
  const filtered = projects.filter((p) => {
    const title = (p.title || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const tagsS = Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase() : "";
    const matchText = title.includes(q) || desc.includes(q) || tagsS.includes(q);
    const matchCat =
      category === "Todas" ||
      (Array.isArray(p.tags) && p.tags.includes(category)) ||
      p.type === category ||
      p.technology === category ||
      p.theme === category;
    const matchFollowing = !showFollowingOnly || (user && following.includes(p.uid));
    return matchText && matchCat && matchFollowing;
  });

  const calcularReputacion = (usuario) => {
    const proyectos = projects.filter((p) => p.uid === usuario);
    let puntos = 0;
    proyectos.forEach((p) => {
      puntos += (p.likes?.length || 0) * 2;
      puntos += (p.comments?.length || 0);
    });
    puntos += proyectos.length * 5;
    puntos += (usuarios[usuario]?.seguidores?.length || 0) * 2;
    return puntos;
  };

  const ranking = Object.entries(usuarios)
    .map(([uid, datos]) => ({
      uid,
      nombre: datos.name || datos.nombre || "Anónimo",
      puntos: calcularReputacion(uid),
    }))
    .sort((a, b) => b.puntos - a.puntos)
    .slice(0, 10);

  return (
    <div className="todos-container">
      <section className="hero">
        <h1>Mi OpenLab</h1>
        <p>Explora proyectos públicos o comparte los tuyos con la comunidad.</p>

        <div className="hero-buttons">
          {!user ? (
            <>
              <button className="btn-primary" onClick={() => navigate("/register")}>Regístrate</button>
              <button className="login-link" onClick={() => navigate("/login")}>Iniciar sesión</button>
            </>
          ) : (
            <div className="profile-info">
              <p className="welcome-msg">Bienvenido, <strong>{user.email}</strong></p>
              <button className="btn-primary" onClick={() => navigate("/profile")}>Ir a tu perfil</button>
              <button
                className="btn-logout"
                onClick={handleLogout}
                style={{ marginTop: "0.5rem", backgroundColor: "#e63946", color: "#fff" }}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="search-bar">
        <input
          type="search"
          placeholder="Buscar por título, descripción o etiquetas…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-bar">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Todas">Todas las categorías</option>
          {tagsArray.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {user && (
          <button
            className={`btn-secondary ${showFollowingOnly ? "active" : ""}`}
            onClick={() => setShowFollowingOnly(!showFollowingOnly)}
            title="Mostrar solo proyectos de personas que sigues"
            style={{ marginLeft: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UserCheck size={18} /> {showFollowingOnly ? "Siguiendo" : "Ver todos"}
          </button>
        )}
      </div>

      <section id="lista-proyectos">
        <h2 className="todos-title">Proyectos públicos</h2>
        {filtered.length === 0 && <p>No hay proyectos que coincidan.</p>}

        <div className="todos-grid">
          {filtered.map((p) => {
            const liked = user && p.likes?.includes(user.uid);
            const fav = user && p.favorites?.includes(user.uid);
            const open = openId === p.id;
            const sigoAutor = user && following.includes(p.uid);
            const autorNombre = usuarios[p.uid]?.name || usuarios[p.uid]?.nombre || p.authorName || "Anónimo";

            return (
              <div key={p.id} className={`todos-card ${sigoAutor ? "seguido-card" : ""}`}>
                {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="card-img" />}
                <h3>{p.title}</h3>
                <p className="autor">
                  Autor: <Link to={`/profile/${p.uid}`}>{autorNombre}</Link>
                  {sigoAutor && <span className="siguiendo-label"> — Sigues a este usuario</span>}
                </p>

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
                        <li key={i}>
                          <b><Link to={`/profile/${c.userId}`}>{c.userEmail}</Link></b>: {c.text}
                        </li>
                      ))}
                    </ul>
                    {user && (
                      <>
                        <textarea
                          rows="2"
                          value={comment}
                          placeholder="Escribe un comentario…"
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <button onClick={() => addComment(p)}>Enviar</button>
                      </>
                    )}
                  </div>
                )}

                <Link to={`/proyecto/${p.id}`} className="mas-info">
                  Más información
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section id="ranking-usuarios">
  <h2 className="todos-title">Ranking de usuarios más activos</h2>
  <div className="ranking-grid">
    {ranking.map((u, i) => (
      <div key={u.uid} className="ranking-card">
        <div className="ranking-header">
          <span className="ranking-position">#{i + 1}</span>
          <span className="ranking-name">{u.nombre}</span>
        </div>
        <div className="ranking-points">{u.puntos} puntos</div>
        {logros[u.uid] && (
          <div className="ranking-logros">
            {logros[u.uid].map((logro, j) => (
              <div key={j} className="logro-badge">{logro}</div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
</section>
    </div>
  );
};

export default TodosLosProyectos;
