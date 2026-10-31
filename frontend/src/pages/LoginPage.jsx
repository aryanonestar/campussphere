import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, demoAccounts, isDemoMode } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { user } = await login(formData);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async (role) => {
    const credentials = demoAccounts[role];
    if (!credentials) return;

    setFormData(credentials);
    setLoading(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 220));
      const { user } = await login(credentials);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue managing courses, profiles, and analytics, or launch a polished instant demo."
      asideTitle="Campus operations, elevated"
      asideText="Walk through student and admin journeys with a premium workspace, seeded mock data, and interactions that feel like a real production portal."
      heroImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
      heroBadge="Interactive demo enabled"
      heroStats={[
        { label: 'Live demo roles', value: 'Student + Admin' },
        { label: 'Courses seeded', value: '6 premium tracks' },
        { label: 'Admin actions', value: 'Create, assign, edit' },
      ]}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField
          label="Email address"
          type="email"
          name="email"
          placeholder="student@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading} className="primary-btn w-full">
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      {isDemoMode ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-[28px] border border-brand-200/70 bg-brand-50/80 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white/80 p-3 text-brand-600 dark:bg-slate-900/70 dark:text-brand-300">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  One-click demo access
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Clicking a demo card auto-fills the form and signs you in with rich mock data already wired into the portal.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleDemoAccess('student')}
              disabled={loading}
              className="group rounded-[28px] border border-white/30 bg-gradient-to-br from-sky-500 via-brand-500 to-indigo-600 p-5 text-left text-white shadow-soft transition hover:-translate-y-1 disabled:opacity-70"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                  <UserRound size={18} />
                </div>
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.3em] text-white/70">Student Demo</p>
              <p className="mt-2 text-xl font-semibold">Aarav Sharma</p>
              <p className="mt-2 text-sm text-white/80">{demoAccounts.student.email}</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoAccess('admin')}
              disabled={loading}
              className="group rounded-[28px] border border-white/30 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 p-5 text-left text-white shadow-soft transition hover:-translate-y-1 disabled:opacity-70"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                  <ShieldCheck size={18} />
                </div>
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.3em] text-white/70">Admin Demo</p>
              <p className="mt-2 text-xl font-semibold">Dr. Maya Bennett</p>
              <p className="mt-2 text-sm text-white/80">{demoAccounts.admin.email}</p>
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: LockKeyhole,
                label: 'Student password',
                value: demoAccounts.student.password,
              },
              {
                icon: ShieldCheck,
                label: 'Admin password',
                value: demoAccounts.admin.password,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-3xl border border-white/20 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-900 p-3 text-white dark:bg-white dark:text-slate-900">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 font-semibold text-slate-900 dark:text-white">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Need an account?{' '}
        <Link className="font-semibold text-brand-500 hover:text-brand-600" to="/register">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
};

export default LoginPage;
