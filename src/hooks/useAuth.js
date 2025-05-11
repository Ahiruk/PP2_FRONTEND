import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => useContext(AuthContext);
// Este hook personalizado permite acceder al contexto de autenticación en cualquier componente de la aplicación.
// Utiliza el hook useContext para obtener el valor del contexto AuthContext, que contiene información sobre el usuario autenticado y funciones relacionadas con la autenticación.