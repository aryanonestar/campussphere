import { Menu } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ title, description, children }) => {
  const { user, isDemoMode } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-hero-grid px-4 py-4 dark:bg-hero-grid-dark md:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="space-y-4">
          <header className="glass-panel overflow-hidden rounded-[28px] p-5">
            <div className="pointer-events-none absolute" />
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="secondary-btn lg:hidden"
                >
                  <Menu size={18} />
                </button>
                <div>
                  <p className="text-sm text-brand-500">
                    {isDemoMode ? 'Demo environment ready' : 'Welcome back'}
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white dark:bg-white dark:text-slate-900">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name}
                      className="h-11 w-11 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-lg font-bold text-white dark:text-white">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs uppercase tracking-[0.25em] opacity-70">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {isDemoMode ? (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[24px] border border-brand-200/70 bg-brand-50/80 px-4 py-3 text-sm text-slate-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-slate-200">
                <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  Demo
                </span>
                <span>
                  This portal is using seeded in-code mock data, so student and admin actions work without a database.
                </span>
              </div>
            ) : null}
          </header>

          <main>{children}</main>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/40 p-4 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div className="h-full max-w-sm" onClick={(event) => event.stopPropagation()}>
              <Sidebar />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
