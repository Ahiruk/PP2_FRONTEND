import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ThemeMenu = () => {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const activateLightMode = () => {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
    setIsDark(false);
  };

  const activateDarkMode = () => {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
    setIsDark(true);
  };

  const goToProfile = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-gray-300 dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded shadow"
      >
        ☰
      </button>

      {menuOpen && (
        <div className="mt-2 bg-white dark:bg-gray-700 text-black dark:text-white rounded shadow p-2 space-y-2 w-44">
          <button
            onClick={activateLightMode}
            className="w-full text-left px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            ☀️ Modo Claro
          </button>

          <button
            onClick={activateDarkMode}
            className="w-full text-left px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            🌙 Modo Oscuro
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeMenu;
