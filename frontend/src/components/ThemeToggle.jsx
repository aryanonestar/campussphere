import { Moon, SunMedium } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useAuth();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="secondary-btn gap-2"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
      <span>{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
    </button>
  );
};

export default ThemeToggle;

