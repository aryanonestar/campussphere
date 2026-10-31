import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { BriefcaseBusiness, CheckCircle2, Mail, MapPin, Phone, UserCircle2, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';

// Fields that count toward profile completion
const COMPLETION_FIELDS = ['phone', 'location', 'bio', 'department'];

const getCompletionInfo = (user) => {
  const filled = COMPLETION_FIELDS.filter((f) => user?.[f]?.trim());
  return {
    count: filled.length,
    total: COMPLETION_FIELDS.length,
    percent: Math.round((filled.length / COMPLETION_FIELDS.length) * 100),
    missing: COMPLETION_FIELDS.filter((f) => !user?.[f]?.trim()),
    isComplete: filled.length === COMPLETION_FIELDS.length,
  };
};

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

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const completion = getCompletionInfo(user);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    department: user?.department || '',
  });
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(!completion.isComplete);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      setFormData((current) => ({ ...current, password: '' }));
      toast.success('Profile updated successfully.');
      // Re-evaluate banner after save
      const newCompletion = getCompletionInfo({
        ...user,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        department: formData.department,
      });
      if (newCompletion.isComplete) setShowBanner(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  const MISSING_LABELS = {
    phone: 'Phone number',
    location: 'Location',
    bio: 'Bio',
    department: 'Department',
  };

  return (
    <DashboardLayout
      title="Profile"
      description="Update your personal details and keep your account information current."
    >
      {/* Profile completion banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mb-4 glass-panel rounded-[24px] p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-2xl bg-amber-500 p-2 text-white">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Your profile is {completion.percent}% complete
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Fill in{' '}
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {completion.missing.map((f) => MISSING_LABELS[f]).join(', ')}
                    </span>{' '}
                    to complete your profile.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:shrink-0">
                {/* Progress bar */}
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">{completion.count}/{completion.total} fields</span>
                    <span className="text-xs font-semibold text-amber-500">{completion.percent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completion.percent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full bg-amber-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBanner(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left — snapshot card */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel overflow-hidden rounded-[28px]"
        >
          <div className="relative h-56">
            <img
              src={
                user?.enrolledCourses?.[0]?.image ||
                'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80'
              }
              alt={user?.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/45 to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-end gap-4 text-white">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name}
                  className="h-24 w-24 rounded-[28px] object-cover ring-4 ring-white/15"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-brand-500 text-4xl font-bold text-white ring-4 ring-white/15">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Account snapshot</p>
                <h3 className="mt-2 text-3xl font-semibold">{user?.name}</h3>
                <p className="mt-1 text-sm text-white/75">{user?.title || user?.role || 'Student'}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {/* Completion pill */}
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
              completion.isComplete
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
            }`}>
              {completion.isComplete
                ? <><CheckCircle2 size={13} /> Profile complete</>
                : <><UserCircle2 size={13} /> {completion.percent}% complete</>
              }
            </div>

            {[
              ['Full name', user?.name],
              ['Email', user?.email],
              ['Role', user?.role],
              ['Courses', String(user?.enrolledCourses?.length || 0)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/20 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/50"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
              </div>
            ))}

            <div className="grid gap-3">
              {[
                { icon: BriefcaseBusiness, label: 'Department', value: user?.department },
                { icon: Phone, label: 'Phone', value: user?.phone },
                { icon: MapPin, label: 'Location', value: user?.location },
                { icon: Mail, label: 'Contact', value: user?.email },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/20 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-2xl p-3 ${
                      value
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
                      <p className={`mt-1 text-sm font-semibold ${
                        value
                          ? 'text-slate-900 dark:text-white'
                          : 'italic text-slate-400 dark:text-slate-500'
                      }`}>
                        {value || 'Not set — fill in the form →'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bio display */}
            {user?.bio && (
              <div className="rounded-3xl border border-white/20 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/50">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Bio</p>
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{user.bio}</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Right — edit form */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-[28px] p-6"
        >
          <p className="text-sm text-brand-500">Edit profile</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            Keep your portal identity updated
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            All changes are saved to your demo session instantly.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Account fields */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Account
              </p>
              <div className="space-y-4">
                <FormField
                  label="Full name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Email address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="New password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                />
              </div>
            </div>

            {/* Profile completion fields */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Profile details
                </p>
                {!completion.isComplete && (
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-300">
                    {completion.missing.length} field{completion.missing.length !== 1 ? 's' : ''} missing
                  </span>
                )}
              </div>
              <div className="space-y-4">
                {/* Department dropdown */}
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    Department
                    {!user?.department && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-300">
                        Missing
                      </span>
                    )}
                  </span>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select your department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </label>

                <FormField
                  label={
                    <span className="flex items-center gap-2">
                      Phone number
                      {!user?.phone && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-300">
                          Missing
                        </span>
                      )}
                    </span>
                  }
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 99999 00000"
                />

                <FormField
                  label={
                    <span className="flex items-center gap-2">
                      Location
                      {!user?.location && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-300">
                          Missing
                        </span>
                      )}
                    </span>
                  }
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Residence Hall A, Block B"
                />

                {/* Bio textarea */}
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    Bio
                    {!user?.bio && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-300">
                        Missing
                      </span>
                    )}
                  </span>
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell the campus who you are — your focus, interests, or goals."
                    className="input-field resize-none"
                  />
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="primary-btn w-full">
              {loading ? 'Saving changes...' : 'Save profile'}
            </button>
          </form>
        </motion.section>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
