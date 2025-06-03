import { useState } from "react";
import { LogOut, User, FileText, Menu, Sun, Moon, ZoomIn, ZoomOut, RotateCcw, Type } from "lucide-react";
import { Link } from "react-router-dom";
import "./FloatingMenu.css";
import useTheme from "../hooks/useTheme";

export default function FloatingMenu({ items }) {
  const [open, setOpen] = useState(false);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const toggleMenu = () => setOpen(!open);
  const toggleFontMenu = () => setFontMenuOpen(!fontMenuOpen);

  const resetFontSize = () => {
    document.documentElement.style.fontSize = "";
  };

  const increaseFontSize = () => {
    const html = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(html).fontSize);
    html.style.fontSize = `${currentSize + 3}px`;
  };

  const decreaseFontSize = () => {
    const html = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(html).fontSize);
    html.style.fontSize = `${currentSize - 3}px`;
  };

  const handleFontAction = (action) => {
    action();
    setOpen(false);
    setFontMenuOpen(false); // Cerrar siempre el submenú al usar botones internos
  };

  return (
    <div className="fab-wrapper">
      <ul className={`fab-items ${open ? "open" : ""}`}>
        {items.map(({ icon: Icon, label, to, onClick }, i) => (
          <li key={label} style={{ transitionDelay: `${i * 40}ms` }}>
            {to ? (
              <Link to={to} className="fab-link" title={label} onClick={() => setOpen(false)}>
                <Icon size={20} />
                <span className="fab-tooltip">{label}</span>
              </Link>
            ) : (
              <button className="fab-link" title={label} onClick={() => { onClick?.(); setOpen(false); }}>
                <Icon size={20} />
                <span className="fab-tooltip">{label}</span>
              </button>
            )}
          </li>
        ))}

        {/* Botón para desplegar menú de tamaño de fuente */}
        <li>
          <button className="fab-link" onClick={toggleFontMenu}>
            <Type size={20} />
            <span className="fab-tooltip">Texto</span>
          </button>

          {/* Menú secundario desplegable para ajustar tamaño del texto */}
          {fontMenuOpen && (
            <ul className="fab-items font-size-menu open">
              <li>
                <button className="fab-link" onClick={() => handleFontAction(increaseFontSize)}>
                  <ZoomIn size={20} />
                  <span className="fab-tooltip">Aumentar</span>
                </button>
              </li>
              <li>
                <button className="fab-link" onClick={() => handleFontAction(decreaseFontSize)}>
                  <ZoomOut size={20} />
                  <span className="fab-tooltip">Reducir</span>
                </button>
              </li>
              <li>
                <button className="fab-link" onClick={() => handleFontAction(resetFontSize)}>
                  <RotateCcw size={20} />
                  <span className="fab-tooltip">Restablecer</span>
                </button>
              </li>
            </ul>
          )}
        </li>

        {/* Toggle para tema claro/oscuro */}
        <li>
          <button className="fab-link" onClick={() => { toggleTheme(); setOpen(false); }}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="fab-tooltip">{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </li>
      </ul>

      <button className="fab-main" aria-label="Menú" onClick={toggleMenu}>
        <Menu size={24} />
      </button>
    </div>
  );
}
