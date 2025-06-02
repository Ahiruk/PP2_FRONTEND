import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./Register.css";

export default function Register() {
  const [step, setStep] = useState(1);
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

  const isInstitutionalEmail = (email) => {
    return email.endsWith("@uninorte.edu.co");
  };

  const nextStep = () => {
    if (!name || !email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (!isInstitutionalEmail(email)) {
      setError("Solo se permite el correo institucional @uninorte.edu.co");
      return;
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }
    setError("");
    setPasswordError("");
    setStep(2);
  };

  const prevStep = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setSuccessMessage("Registrado exitosamente");

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
        createdAt: new Date().toISOString(),
      });

      setSuccessMessage("Registrado correctamente");
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="register-image-section">
          <img src="/assets/signup-illustration.png" alt="Registro" />
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="progress-bar">
            <div className={`step ${step >= 1 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}></div>
          </div>

          <h2 className="register-title">Crea tu cuenta</h2>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          {step === 1 && (
            <div className="form-step animate-step">
              <label>Nombre Completo</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

              <label>Correo institucional</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tucorreo@uninorte.edu.co" />

              <label>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {passwordError && <p className="error-message">{passwordError}</p>}

              <button type="button" onClick={nextStep} className="submit-btn">Siguiente</button>

<p className="login-link-text">
  ¿Ya tienes cuenta?{" "}
  <span className="login-link" onClick={() => navigate("/login")}>
    Inicia sesión
  </span>
</p>

            </div>
          )}

          {step === 2 && (
            <div className="form-step animate-step">
              <label>Biografía</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="3" />

              <label>Foto de perfil</label>
              <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />

              <button type="submit" className="submit-btn">Registrarse</button>
              <button type="button" onClick={prevStep} className="return-btn">Atrás</button>
            </div>
          )}
        </form>
        {successMessage && (
  <div className="success-modal">
  <img src="/assets/success-icon.png" alt="Éxito" />
    <h3>¡Registro Exitoso!</h3>
    <p>Tu cuenta ha sido creada correctamente.</p>
    <button onClick={() => navigate("/profile")}>Ir al perfil</button>
  </div>
)}

      </div>
    </div>
  );
}
