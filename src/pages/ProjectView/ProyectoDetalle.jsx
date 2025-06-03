import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import "./ProyectoDetalle.css";

const ProyectoDetalle = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const publicProjects = results.filter(proj => proj.visibility === "public" && !proj.deleted);
        setProjects(publicProjects);
      } catch (error) {
        console.error("❌ Error al obtener proyectos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLike = async (project) => {
    if (!user) {
      alert("Debes estar logueado para dar like.");
      return;
    }
    const docRef = doc(db, "projects", project.id);
    const userHasLiked = project.likes?.includes(user.uid);

    try {
      if (userHasLiked) {
        await updateDoc(docRef, {
          likes: arrayRemove(user.uid),
        });
        setProjects(projects.map(p => p.id === project.id
          ? { ...p, likes: p.likes.filter(uid => uid !== user.uid) }
          : p));
      } else {
        await updateDoc(docRef, {
          likes: arrayUnion(user.uid),
        });
        setProjects(projects.map(p => p.id === project.id
          ? { ...p, likes: [...(p.likes || []), user.uid] }
          : p));
      }
    } catch (error) {
      console.error("Error al actualizar likes:", error);
    }
  };

  const handleFavorite = async (project) => {
    if (!user) {
      alert("Debes estar logueado para marcar favorito.");
      return;
    }
    const docRef = doc(db, "projects", project.id);
    const userHasFavorited = project.favorites?.includes(user.uid);

    try {
      if (userHasFavorited) {
        await updateDoc(docRef, {
          favorites: arrayRemove(user.uid),
        });
        setProjects(projects.map(p => p.id === project.id
          ? { ...p, favorites: p.favorites.filter(uid => uid !== user.uid) }
          : p));
      } else {
        await updateDoc(docRef, {
          favorites: arrayUnion(user.uid),
        });
        setProjects(projects.map(p => p.id === project.id
          ? { ...p, favorites: [...(p.favorites || []), user.uid] }
          : p));
      }
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
    }
  };

  const [commentText, setCommentText] = useState("");
  const handleAddComment = async (project) => {
    if (!user) {
      alert("Debes estar logueado para comentar.");
      return;
    }
    if (!commentText.trim()) return;

    const docRef = doc(db, "projects", project.id);
    const newComment = {
      userId: user.uid,
      userEmail: user.email,
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await updateDoc(docRef, {
        comments: arrayUnion(newComment),
      });

      setProjects(projects.map(p => p.id === project.id
        ? { ...p, comments: [...(p.comments || []), newComment] }
        : p));

      setCommentText("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  if (loading) return <p>Cargando proyectos...</p>;

  return (
    <div className="project-list-container">
      <h1>Proyectos Públicos</h1>

      {!user && <p>Para dar like, comentar o marcar favorito debes <a href="/login">iniciar sesión</a>.</p>}

      {projects.length === 0 && <p>No hay proyectos públicos disponibles.</p>}

      {projects.map(project => {
        const userLiked = user && project.likes?.includes(user.uid);
        const userFavorited = user && project.favorites?.includes(user.uid);

        return (
          <div key={project.id} className="project-card">
            <h2>{project.title}</h2>
            <p>Autor: {project.authorName || "Anónimo"}</p>
            {project.imageUrl && <img src={project.imageUrl} alt={project.title} style={{ maxWidth: "200px" }} />}
            <p>{project.description}</p>

            {project.githubLink && (
              <p>
                GitHub: <a href={project.githubLink} target="_blank" rel="noopener noreferrer">{project.githubLink}</a>
              </p>
            )}

            {project.videoLink && (
              <p>
                Video: <a href={project.videoLink} target="_blank" rel="noopener noreferrer">{project.videoLink}</a>
              </p>
            )}

            {project.tags && project.tags.length > 0 && (
              <p>
                Tags: {project.tags.join(", ")}
              </p>
            )}

            <div className="actions">
              <button onClick={() => handleLike(project)} style={{ color: userLiked ? "red" : "gray" }}>
                ❤️ {project.likes?.length || 0}
              </button>
              <button onClick={() => handleFavorite(project)} style={{ color: userFavorited ? "gold" : "gray" }}>
                ⭐ Favorito
              </button>
            </div>

            <div className="comments-section">
              <h4>Comentarios ({project.comments?.length || 0})</h4>
              <ul>
                {(project.comments || []).map((c, i) => (
                  <li key={i}>
                    <b>{c.userEmail}</b>: {c.text}
                  </li>
                ))}
              </ul>

              {user && (
                <>
                  <textarea
                    rows="2"
                    placeholder="Escribe un comentario..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button onClick={() => handleAddComment(project)}>Enviar</button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProyectoDetalle;
