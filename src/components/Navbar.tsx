import { Activity, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className={`${
        theme === 'dark' 
          ? 'bg-neutral-900/80 border-white/10' 
          : 'bg-white/80 border-gray-200'
      } backdrop-blur-xl border rounded-full shadow-lg transition-colors duration-300`}>
        <div className="flex items-center justify-between h-14 px-6">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className={`w-8 h-8 ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
            } border rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
              <Activity className={`w-4 h-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} />
            </div>
            <span className={`text-sm font-semibold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              StockScope
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                location.pathname === '/'
                  ? theme === 'dark'
                    ? 'bg-white/10 text-white'
                    : 'bg-gray-900 text-white'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/analysis')}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                location.pathname === '/analysis'
                  ? theme === 'dark'
                    ? 'bg-white/10 text-white'
                    : 'bg-gray-900 text-white'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Analysis
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`ml-2 w-8 h-8 ${
                theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
              } rounded-full flex items-center justify-center transition-all duration-200`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
