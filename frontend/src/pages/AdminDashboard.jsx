import { useEffect, useState } from 'react';
import { BarChart3, Bell, BookCopy, BriefcaseBusiness, Megaphone, Trash2, TrendingUp, Users2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import api from '../services/api';

const ANN_TYPES = [
  { value: 'info', label: 'Info', color: 'bg-sky-500' },
  { value: 'success', label: 'Success', color: 'bg-emerald-500' },
  { value: 'warning', label: 'Warning', color: 'bg-amber-500' },
];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsForm, setStatsForm] = useState({ userId: '', attendance: '', learningHours: '', completionRate: '' });
  const [statsLoading, setStatsLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [annForm, setAnnForm] = useState({ title: '', body: '', type: 'info' });
  const [annLoading, setAnnLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/users/analytics');
      setAnalytics(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get('/announcements');
      setAnnouncements(data);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchAnnouncements();
  }, []);

  const handleStatsSubmit = async (event) => {
    event.preventDefault();
    if (!statsForm.userId) {
      toast.error('Please select a student.');
      return;
    }
    setStatsLoading(true);
    try {
      await api.put('/users/update-student-stats', {
        userId: statsForm.userId,
        ...(statsForm.attendance !== '' && { attendance: Number(statsForm.attendance) }),
        ...(statsForm.learningHours !== '' && { learningHours: Number(statsForm.learningHours) }),
        ...(statsForm.completionRate !== '' && { completionRate: Number(statsForm.completionRate) }),
      });
      toast.success('Student stats updated.');
      setStatsForm({ userId: '', attendance: '', learningHours: '', completionRate: '' });
      await fetchAnalytics();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update stats.');
    } finally {
      setStatsLoading(false);
    }
  };

  const handlePostAnnouncement = async (event) => {
    event.preventDefault();
    setAnnLoading(true);
    try {
      await api.post('/announcements', annForm);
      toast.success('Announcement posted to all students.');
      setAnnForm({ title: '', body: '', type: 'info' });
      await fetchAnnouncements();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post announcement.');
    } finally {
      setAnnLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      toast.success('Announcement removed.');
    } catch {
      toast.error('Failed to remove announcement.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard" description="Loading your analytics workspace.">
        <div className="glass-panel rounded-[28px]">
          <Loader label="Preparing analytics..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Admin Dashboard"
      description="Manage students, courses, and academic performance from a unified control room."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Users2} label="Total Students" value={analytics?.totalStudents ?? 0} />
        <StatCard
          icon={BookCopy}
          label="Total Courses"
          value={analytics?.totalCourses ?? 0}
          accent="from-emerald-500 to-teal-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Enrollments"
          value={analytics?.totalEnrollments ?? 0}
          accent="from-fuchsia-500 to-pink-400"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel overflow-hidden rounded-[28px]"
        >
          <div className="relative h-72">
            <img
              src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1400&q=80"
              alt="Admin overview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
            <div className="absolute inset-0 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Control Room</p>
              <h3 className="mt-4 max-w-xl text-3xl font-semibold leading-tight">
                Manage courses, student growth, and academic delivery from one premium workspace.
              </h3>
              <div className="mt-6 grid max-w-xl gap-3 sm:grid-cols-3">
                {[
                  { label: 'New signups', value: analytics?.recentStudents?.length ?? 0 },
                  { label: 'Programs live', value: analytics?.totalCourses ?? 0 },
                  { label: 'Student reach', value: analytics?.totalStudents ?? 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/60">{label}</p>
                    <p className="mt-1 text-xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-panel rounded-[28px] p-6"
        >
          <p className="text-sm text-brand-500">Operations pulse</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            Delivery highlights
          </h3>

          <div className="mt-6 space-y-4">
            {[
              {
                label: 'Engagement status',
                value: 'Healthy growth across active learning tracks',
                icon: BarChart3,
              },
              {
                label: 'Admin workload',
                value: `${analytics?.featuredCourses?.length || 0} featured courses under watch`,
                icon: BriefcaseBusiness,
              },
              {
                label: 'Student momentum',
                value: `${analytics?.recentStudents?.length || 0} recent registrations in the pipeline`,
                icon: Users2,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-3xl border border-white/20 bg-white/50 p-4 dark:border-white/10 dark:bg-slate-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-900 p-3 text-white dark:bg-white dark:text-slate-900">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                      {value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel mt-4 rounded-[28px] p-6"
      >
        <p className="text-sm text-brand-500">Update student stats</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
          Set attendance &amp; progress
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          New students start at zero. Use this panel to record their actual attendance, learning hours, and completion rate.
        </p>

        <form onSubmit={handleStatsSubmit} className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="block sm:col-span-2 xl:col-span-4">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Student</span>
            <select
              value={statsForm.userId}
              onChange={(e) => setStatsForm((s) => ({ ...s, userId: e.target.value }))}
              className="input-field"
              required
            >
              <option value="">Select a student</option>
              {analytics?.recentStudents?.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} — {student.email}
                </option>
              ))}
            </select>
          </label>

          {[
            { field: 'attendance', label: 'Attendance (%)', min: 0, max: 100 },
            { field: 'learningHours', label: 'Learning Hours', min: 0, max: undefined },
            { field: 'completionRate', label: 'Completion Rate (%)', min: 0, max: 100 },
          ].map(({ field, label, min, max }) => (
            <label key={field} className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
              <input
                type="number"
                min={min}
                max={max}
                value={statsForm[field]}
                onChange={(e) => setStatsForm((s) => ({ ...s, [field]: e.target.value }))}
                placeholder={`Leave blank to keep current`}
                className="input-field"
              />
            </label>
          ))}

          <div className="flex items-end sm:col-span-2 xl:col-span-4">
            <button type="submit" disabled={statsLoading} className="primary-btn">
              {statsLoading ? 'Saving...' : 'Update student stats'}
            </button>
          </div>
        </form>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel mt-4 rounded-[28px] p-6"
      >
        <p className="text-sm text-brand-500">Student roster</p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
          Latest registered students
        </h3>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/20 dark:border-white/10">
          <div className="grid grid-cols-[1.1fr_1fr_0.6fr] bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            <span>Name</span>
            <span>Email</span>
            <span>Courses</span>
          </div>

          {analytics?.recentStudents?.length ? (
            analytics.recentStudents.map((student) => (
              <div
                key={student._id}
                className="grid grid-cols-[1.1fr_1fr_0.6fr] items-center border-t border-white/20 bg-white/70 px-4 py-4 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200"
              >
                <span className="flex items-center gap-3">
                  {student.avatar ? (
                    <img src={student.avatar} alt={student.name} className="h-10 w-10 rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-sm font-bold text-white">
                      {student.name?.[0]?.toUpperCase() || 'S'}
                    </div>
                  )}
                  <span>{student.name}</span>
                </span>
                <span>{student.email}</span>
                <span>{student.enrolledCourses?.length || 0}</span>
              </div>
            ))
          ) : (
            <div className="bg-white/70 px-4 py-8 text-center text-sm text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              No students found yet.
            </div>
          )}
        </div>
      </motion.section>

      {/* ── Announcements panel ─────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel mt-4 rounded-[28px] p-6"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-500 p-2 text-white">
            <Megaphone size={18} />
          </div>
          <div>
            <p className="text-sm text-brand-500">Announcements</p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Post a message to all students
            </h3>
          </div>
        </div>

        <form onSubmit={handlePostAnnouncement} className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <input
              required
              value={annForm.title}
              onChange={(e) => setAnnForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Announcement title (e.g. Mid-term exam schedule updated)"
              className="input-field"
            />
            <textarea
              required
              rows={3}
              value={annForm.body}
              onChange={(e) => setAnnForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="Write the full announcement message here…"
              className="input-field resize-none"
            />
            <div className="flex gap-2">
              {ANN_TYPES.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAnnForm((f) => ({ ...f, type: value }))}
                  className={`rounded-full px-3 py-1 text-xs font-semibold text-white transition ${color} ${annForm.type === value ? 'ring-2 ring-offset-2 ring-brand-400' : 'opacity-60 hover:opacity-90'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={annLoading}
            className="primary-btn self-start whitespace-nowrap"
          >
            {annLoading ? 'Posting…' : 'Post announcement'}
          </button>
        </form>

        {/* Posted announcements list */}
        {announcements.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {announcements.length} posted announcement{announcements.length !== 1 ? 's' : ''}
            </p>
            {announcements.map((ann) => {
              const typeColor = ANN_TYPES.find((t) => t.value === ann.type)?.color || 'bg-sky-500';
              return (
                <div
                  key={ann._id}
                  className="flex items-start gap-3 rounded-[20px] border border-white/20 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/50"
                >
                  <div className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${typeColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white">{ann.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{ann.body}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Posted by {ann.author} · {new Date(ann.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAnnouncement(ann._id)}
                    className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </motion.section>
    </DashboardLayout>
  );
};

export default AdminDashboard;
