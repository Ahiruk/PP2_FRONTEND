import {
    useState
} from "react";
import {
    createUserWithEmailAndPassword
} from "firebase/auth";
import {
    auth
} from "../../services/firebase";
import {
    useNavigate
} from "react-router-dom";
import "./Register.css";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-]/.test(password);

        if (password.length < minLength) {
            return "La contraseña debe tener al menos 6 caracteres.";
        }
        if (!hasUpperCase) {
            return "La contraseña debe contener al menos una letra mayúscula.";
        }
        if (!hasNumber) {
            return "La contraseña debe contener al menos un número.";
        }
        if (!hasSpecialChar) {
            return "La contraseña debe contener al menos un carácter especial.";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setPasswordError("");

        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/login"); // redirige al login después del registro exitoso
        } catch (err) {
            setError(err.message);
        }
    };

    const goToLogin = () => {
        navigate("/login");
    };

    return ( <
            div className = "register-container" >
            <
            form onSubmit = {
                handleSubmit
            }
            className = "register-form" >
            <
            h2 className = "register-title" > Registro < /h2> {
                error && < p className = "error-message" > {
                        error
                    } < /p>} <
                    input
                type = "email"
                placeholder = "Correo electrónico"
                value = {
                    email
                }
                onChange = {
                    (e) => setEmail(e.target.value)
                }
                className = "input-field"
                required
                    /
                    >
                    <
                    input
                type = "password"
                placeholder = "Contraseña"
                value = {
                    password
                }
                onChange = {
                    (e) => setPassword(e.target.value)
                }
                className = "input-field"
                required
                    /
                    > {
                        passwordError && < p className = "error-message" > {
                            passwordError
                        } < /p>} <
                        button type = "submit"
                        className = "submit-btn" >
                        Registrarse <
                        /button>

                        <
                        button button
                        type = "button"
                        onClick = {
                            goToLogin
                        }
                        className = "return-btn" >
                        Volver al Login <
                        /button> <
                        /form> <
                        /div>
                    );
            }