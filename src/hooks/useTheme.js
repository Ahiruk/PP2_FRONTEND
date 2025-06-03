// hooks/useTheme.js
import { useEffect, useState } from 'react';

const useTheme = () => {
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return { isDark, toggleTheme };
};

export default useTheme;
