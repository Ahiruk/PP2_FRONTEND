import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-]/.test(password);

    if (password.length < minLength) return "La contraseña debe tener al menos 6 caracteres.";
    if (!hasUpperCase) return "La contraseña debe contener al menos una letra mayúscula.";
    if (!hasNumber) return "La contraseña debe contener al menos un número.";
    if (!hasSpecialChar) return "La contraseña debe contener al menos un carácter especial.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setSuccessMessage("Registrado exitosamente");

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      let photoURL = "";

      if (photo) {
        const storageRef = ref(storage, `profile_pictures/${uid}-${uuidv4()}`);
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        name,
        bio,
        photoURL,
        createdAt: new Date().toISOString()
      });

      setSuccessMessage("Registrado correctamente");
      navigate("/profile");  // redirige inmediatamente

    } catch (err) {
      setError(err.message);
    }
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Registro</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          required
        />

        <textarea
          placeholder="Biografía (opcional)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="input-field"
          rows="3"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="input-field"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />

        {passwordError && <p className="error-message">{passwordError}</p>}

        <button type="submit" className="submit-btn">Registrarse</button>

        <button type="button" onClick={goToLogin} className="return-btn">
          Volver al Login
        </button>
      </form>
    </div>
  );
}
