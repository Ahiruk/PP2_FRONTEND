import { useState } from "react";
import { LogOut, User, FileText, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import "./FloatingMenu.css";

/**
 * FloatingMenu – botón circular fijo en la esquina inferior derecha.
 * Al pulsar, despliega los items verticalmente hacia arriba.
 *
 * Props:
 *   items: Array<{ icon: ReactNode, label: string, to?: string, onClick?: ()=>void }>
 *          Usa `to` para navegación (react‑router) o `onClick` para acciones (logout).
 */
export default function FloatingMenu({ items }) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <div className="fab-wrapper">
      {/* Items */}
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
      </ul>

      {/* Botón principal */}
      <button className="fab-main" aria-label="Menú" onClick={toggle}>
        <Menu size={24} />
      </button>
    </div>
  );
}
