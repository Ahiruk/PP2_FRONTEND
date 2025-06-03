import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import "./UserProfile.css";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    };
    fetchUser();
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
      </div>
    </div>
  );
} 
