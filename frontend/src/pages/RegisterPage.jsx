import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AuthShell from '../components/AuthShell';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Artificial Intelligence & ML',
  'Electronics & Communication',
  'Business Administration',
  'Data Science & Analytics',
  'Cybersecurity',
  'Cloud & Infrastructure',
  'Design & Media',
  'Other',
];

// Returns { score: 0-4, label, color, barColor }
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', barColor: '' };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const levels = [
    { score: 0, label: '', barColor: '' },
    { score: 1, label: 'Very weak', barColor: 'bg-rose-500' },
    { score: 2, label: 'Weak', barColor: 'bg-orange-400' },
    { score: 3, label: 'Fair', barColor: 'bg-amber-400' },
    { score: 4, label: 'Strong', barColor: 'bg-emerald-500' },
    { score: 5, label: 'Very strong', barColor: 'bg-emerald-600' },
  ];
  return levels[Math.min(score, 5)];
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
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
      const { user } = await register(formData);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(formData.password);
  const strengthPercent = formData.password ? (strength.score / 5) * 100 : 0;

  return (
    <AuthShell
      title="Create account"
      subtitle="Register as a student or admin and launch your portal workspace with seeded demo-ready course flows."
      asideTitle="Built for modern academic operations"
      asideText="The portal supports realistic onboarding, role-aware workspaces, premium UI details, and mock-powered usage that still behaves like a real product."
      heroImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"
      heroBadge="Rapid onboarding"
      heroStats={[
        { label: 'Setup time', value: 'Under 1 minute' },
        { label: 'Role routing', value: 'Auto dashboard redirect' },
        { label: 'Starter access', value: 'Seeded course paths' },
      ]}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField
          label="Full name"
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <FormField
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password field with live strength bar */}
        <div>
          <FormField
            label="Password"
            type="password"
            name="password"
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {formData.password && (
            <div className="mt-2">
              {/* Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${strengthPercent}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-full rounded-full transition-colors ${strength.barColor}`}
                />
              </div>
              {/* Label */}
              <div className="mt-1.5 flex items-center justify-between">
                <p className={`text-xs font-medium ${
                  strength.score <= 2 ? 'text-rose-500' :
                  strength.score === 3 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {strength.label}
                </p>
                <p className="text-xs text-slate-400">
                  {strength.score >= 4 ? '✓ Good to go' : 'Add symbols, numbers & capitals to strengthen'}
                </p>
              </div>
            </div>
          )}
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Role</span>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input-field"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Department
          </span>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select your department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={loading} className="primary-btn w-full">
          {loading ? 'Creating account…' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Already registered?{' '}
        <Link className="font-semibold text-brand-500 hover:text-brand-600" to="/login">
          Login here
        </Link>
      </p>
    </AuthShell>
  );
};

export default RegisterPage;
