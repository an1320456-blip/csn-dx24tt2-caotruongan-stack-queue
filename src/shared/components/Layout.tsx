import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Box, Layers, PlayCircle, Home, Menu, X, Sun, Moon, FileText } from 'lucide-react';
import { cn } from '../lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';

function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      aria-label={isDark ? 'Chuyển giao diện sáng' : 'Chuyển giao diện tối'}
      onClick={toggleTheme}
      className={cn(
        'rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white',
        className
      )}
    >
      {isDark ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
    </button>
  );
}

export const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Stack', path: '/stack', icon: Layers },
    { name: 'Queue', path: '/queue', icon: Box },
    { name: 'Practice', path: '/practice', icon: PlayCircle },
    { name: 'About', path: '/about', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/5 glass shadow-xl dark:shadow-2xl backdrop-blur-xl px-4 py-3 sm:px-6 sm:py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group transition-all min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center glow-indigo group-hover:scale-110 transition-transform">
            <Layers className="text-indigo-500 dark:text-indigo-400" size={22} />
          </div>
          <span className="text-lg sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white truncate">Algoverse</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 text-sm font-semibold transition-all hover:text-indigo-500 dark:hover:text-indigo-400 tracking-tight",
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"
                )
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
          <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-2" />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          {/* Mobile menu trigger */}
          <button
            type="button"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 space-y-2 overflow-hidden bg-slate-100/90 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-white/5"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 p-4 rounded-xl text-lg font-bold transition-all",
                    isActive
                      ? "bg-indigo-500/15 text-indigo-700 border border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                      : "text-slate-600 dark:text-slate-400"
                  )
                }
              >
                <item.icon size={22} />
                {item.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-indigo-500/20 dark:selection:bg-indigo-500/30">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-10 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
      <footer className="py-12 border-t border-slate-200 dark:border-white/5 mt-20 bg-white/60 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 dark:text-slate-500 text-sm font-medium">
          <p>© 2026 Algoverse. Kết hợp bởi Trường An 🚀</p>
        </div>
      </footer>
    </div>
  );
};
