import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import "./UserProfile.css";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDataAndProjects = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }

      const q = query(collection(db, "proyectos"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserProjects(projects);

      setLoading(false);
    };

    fetchUserDataAndProjects();
  }, []);

  if (loading) return <div className="user-profile-loading">Cargando perfil...</div>;
  if (!userData) return <div className="user-profile-error">No se encontraron datos del usuario.</div>;

  return (
    <div className="user-dashboard">
      <div className="sidebar">
        <div className="avatar-mini">
          <img src={userData.photoURL} alt="Avatar" />
        </div>
        <ul>
          <li className="active">Mi perfil</li>
          <li>Cuentas</li>
          <li>Pagos</li>
          <li>Soporte</li>
        </ul>
      </div>

      <div className="dashboard-content">
        <h2 className="dashboard-title">Mi perfil</h2>
        <div className="profile-card">
          <img src={userData.photoURL} alt="Foto de perfil" className="profile-img" />
          <div className="profile-info">
            <p><strong>Nombre:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Bio:</strong> {userData.bio || "No definida."}</p>
            <p><strong>Último acceso:</strong> {new Date().toLocaleString()}</p>
          </div>
          <button className="edit-btn">Editar</button>
        </div>

        <h3 className="dashboard-subtitle">Mis Proyectos</h3>
        <div className="projects-list">
          {userProjects.length === 0 ? (
            <p>No tienes proyectos aún.</p>
          ) : (
            userProjects.map((project) => (
              <div key={project.id} className="project-card">
                <h4>{project.titulo}</h4>
                <p>{project.descripcion}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
