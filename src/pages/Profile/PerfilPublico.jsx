import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  db,
  auth
} from "../../services/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  onSnapshot
} from "firebase/firestore";
import "./PerfilPublico.css";

const PerfilPublico = () => {
  const { uid } = useParams();
  const [perfil, setPerfil] = useState(null);
  const currentUser = auth.currentUser;
  const [seguido, setSeguido] = useState(false);
  const [proyectos, setProyectos] = useState([]);
  const [seguidosData, setSeguidosData] = useState([]);
  const [seguidoresData, setSeguidoresData] = useState([]);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const docRef = doc(db, "usuarios", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPerfil(data);
          setSeguido(data.seguidores?.includes(currentUser?.uid));

          // Traer datos de seguidos y seguidores
          const fetchUsuarios = async (uids = []) => {
            const usuarios = await Promise.all(
              uids.map(async id => {
                const u = await getDoc(doc(db, "usuarios", id));
                return u.exists() ? { id, ...u.data() } : { id, name: "Usuario desconocido" };
              })
            );
            return usuarios;
          };

          const seguidos = await fetchUsuarios(data.siguiendo || []);
          const seguidores = await fetchUsuarios(data.seguidores || []);
          setSeguidosData(seguidos);
          setSeguidoresData(seguidores);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    };

    const unsub = onSnapshot(collection(db, "projects"), (snap) => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const delUsuario = all.filter(p => p.uid === uid && p.visibility === "public" && !p.deleted);
      setProyectos(delUsuario);
    });

    fetchPerfil();
    return () => unsub();
  }, [uid]);

  const toggleSeguir = async () => {
    if (!currentUser) return alert("Debes iniciar sesión para seguir usuarios.");
    const yoRef = doc(db, "usuarios", currentUser.uid);
    const elRef = doc(db, "usuarios", uid);

    await updateDoc(yoRef, {
      siguiendo: seguido ? arrayRemove(uid) : arrayUnion(uid)
    });

    await updateDoc(elRef, {
      seguidores: seguido ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
    });

    setSeguido(!seguido);
  };

  if (!perfil) return <p className="loading">Cargando perfil...</p>;

  return (
    <div className="perfil-publico-container">
      <div className="perfil-header">
        {perfil.photoURL && (
          <img
            src={perfil.photoURL}
            alt="Foto de perfil"
            className="perfil-foto"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "1rem",
            }}
          />
        )}

        <div>
          <h2>{perfil.name || perfil.nombre}</h2>
          <p className="perfil-bio">{perfil.bio || perfil.biografia}</p>

          {currentUser && currentUser.uid !== uid && (
            <button onClick={toggleSeguir} className="btn-follow">
              {seguido ? "Dejar de seguir" : "Seguir"}
            </button>
          )}
        </div>
      </div>

      {/* Lista de seguidos y seguidores */}
      <div className="perfil-publico-section">
  <h3>👥 Seguidores y Seguidos</h3>
  <div className="seguidores-listas">
    <div>
      <strong>Siguiendo:</strong>
      {seguidosData.length > 0 ? (
        <ul className="perfil-publico-list imagen-nombre-lista">
          {seguidosData.map((u) => (
            <li key={u.id}>
            <Link
  to={`/profile/${u.id}`}
  className="usuario-item-link"
  title={u.email || "Correo no disponible"}
>
  {u.photoURL && (
    <img
      src={u.photoURL}
      alt="Foto"
      className="mini-avatar"
    />
  )}
  <span>{u.name || u.nombre || "Usuario"}</span>
</Link>

            </li>
          ))}
        </ul>
      ) : (
        <p>No sigue a nadie aún.</p>
      )}
    </div>

    <div>
      <strong>Seguidores:</strong>
      {seguidoresData.length > 0 ? (
        <ul className="perfil-publico-list imagen-nombre-lista">
          {seguidoresData.map((u) => (
            <li key={u.id}>
            <Link
  to={`/profile/${u.id}`}
  className="usuario-item-link"
  title={u.email || "Correo no disponible"}
>
  {u.photoURL && (
    <img
      src={u.photoURL}
      alt="Foto"
      className="mini-avatar"
    />
  )}
  <span>{u.name || u.nombre || "Usuario"}</span>
</Link>

            </li>
          ))}
        </ul>
      ) : (
        <p>Aún no tiene seguidores.</p>
      )}
    </div>
  </div>
</div>


      {[ 
        { label: "🎓 Educación", data: perfil.educacion },
        { label: "💼 Experiencia", data: perfil.experiencia },
        { label: "🧠 Habilidades", data: perfil.habilidades },
        { label: "🛠️ Tecnologías dominadas", data: perfil.tecnologias },
      ].map((section, idx) => (
        <div className="perfil-publico-section" key={idx}>
          <h3>{section.label}</h3>
          {section.data?.length > 0 ? (
            <ul className="perfil-publico-list">
              {section.data.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          ) : (
            <p>No hay información disponible.</p>
          )}
        </div>
      ))}

      <div className="perfil-publico-section">
        <h3>🔗 Redes sociales</h3>
        <ul className="perfil-publico-links">
          {perfil.linkedin && <li><a href={perfil.linkedin} target="_blank">LinkedIn</a></li>}
          {perfil.github && <li><a href={perfil.github} target="_blank">GitHub</a></li>}
          {perfil.twitter && <li><a href={perfil.twitter} target="_blank">Twitter</a></li>}
        </ul>
      </div>

      <div className="perfil-publico-section">
        <h3>📁 Proyectos públicos</h3>
        {proyectos.length === 0 ? (
          <p>No hay proyectos disponibles.</p>
        ) : (
          <ul className="perfil-publico-list">
            {proyectos.map((p) => (
              <li key={p.id}><strong>{p.title}</strong>: {p.description}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PerfilPublico;
