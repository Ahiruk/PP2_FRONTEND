// FloatingMenu.jsx
import { useState } from "react";
import { LogOut, User, FileText, Menu, Sun, Moon, Grid, Users } from "lucide-react";
import { Link } from "react-router-dom";
import "./FloatingMenu.css";
import useTheme from "../hooks/useTheme"; // crearás este hook para manejar el tema fácilmente

export default function FloatingMenu({ items }) {
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const toggle = () => setOpen(!open);

  return (
    <div className="fab-wrapper">
      <ul className={`fab-items ${open ? "open" : ""}`}>
        {/* Ítems originales */}
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

        {/* Nuevo ítem para toggle del tema */}
        <li style={{ transitionDelay: `${items.length * 40}ms` }}>
          <button className="fab-link" onClick={() => { toggleTheme(); setOpen(false); }}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="fab-tooltip">{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </li>
      </ul>

      <button className="fab-main" aria-label="Menú" onClick={toggle}>
        <Menu size={24} />
      </button>
    </div>
  );
}
