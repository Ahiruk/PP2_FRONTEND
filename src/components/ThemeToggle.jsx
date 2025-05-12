// File: src/components/ThemeMenu.jsx
import React, { useEffect, useState } from "react";
import "./ThemeMenu.css";

// Inyecta dinámicamente Iconify si no está cargado
const loadIconify = () => {
  if (!document.getElementById("iconify-script")) {
    const script = document.createElement("script");
    script.id = "iconify-script";
    script.src = "https://code.iconify.design/1/1.0.4/iconify.min.js";
    script.async = true;
    document.head.appendChild(script);
  }
};

const ThemeMenu = () => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    // Carga Iconify una sola vez
    loadIconify();
    // Aplica clase dark y guarda preferencia
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <label className="theme-switch">
      <input
        type="checkbox"
        className="toggle-checkbox"
        checked={isDark}
        onChange={() => setIsDark(!isDark)}
      />
      <div className="toggle-slot">
        <div className="sun-icon-wrapper">
          <span
            className="iconify sun-icon"
            data-icon="feather-sun"
            data-inline="false"
          />
        </div>
        <div className="toggle-button" />
        <div className="moon-icon-wrapper">
          <span
            className="iconify moon-icon"
            data-icon="feather-moon"
            data-inline="false"
          />
        </div>
      </div>
    </label>
  );
};

export default ThemeMenu;