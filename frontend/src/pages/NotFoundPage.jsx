import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const home = user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login';

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-grid px-4 dark:bg-hero-grid-dark">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md rounded-[32px] p-10 text-center"
      >
        {/* Big number */}
        <div className="mx-auto mb-2 flex h-28 w-28 items-center justify-center rounded-[32px] bg-gradient-to-br from-brand-500 to-violet-500 shadow-xl shadow-brand-200/40">
          <span className="text-5xl font-black text-white tracking-tight">404</span>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
          The page you're looking for doesn't exist or was moved. It might be a broken link or a typo in the URL.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate(home)}
            className="primary-btn w-full justify-center"
          >
            Go to dashboard
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="secondary-btn w-full justify-center"
          >
            ← Go back
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-400 dark:text-slate-600">
          Elevate Campus · CampusSphere
        </p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
