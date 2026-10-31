import {
  BadgeCheck,
  BookOpenText,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserCircle2,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/courses', label: 'Courses', icon: BookOpenText },
    { to: '/profile', label: 'Profile', icon: UserCircle2 },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin', icon: ShieldCheck },
    { to: '/courses', label: 'Courses', icon: BookOpenText },
    { to: '/profile', label: 'Profile', icon: UserCircle2 },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="glass-panel flex h-full w-full flex-col rounded-[28px] p-5"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-brand-500">Student Portal</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">Elevate Campus</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Smart learning, enrollment, and administration in one place.
        </p>
      </div>

      <div className="mb-6 rounded-[28px] border border-white/20 bg-slate-900 p-4 text-white dark:border-white/10">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/15"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white ring-2 ring-white/15">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-white/70">{user?.title || user?.role}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.25em] text-white/75">
          <span>{user?.department || 'Campus'}</span>
          {isDemoMode ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] tracking-[0.2em] text-emerald-200">
              <BadgeCheck size={12} />
              Demo
            </span>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-white/70 hover:text-brand-600 dark:text-slate-300 dark:hover:bg-slate-800/80'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => {
          logout();
          navigate('/login');
        }}
        className="secondary-btn mt-6 gap-2"
      >
        <LogOut size={18} />
        Logout
      </button>
    </motion.aside>
  );
};

export default Sidebar;
