import React from 'react';
import { Award, Bell, BookMarked, CheckCircle2, Clock3, GraduationCap, Sparkles, TrendingUp, UserCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import CertificateModal from '../components/CertificateModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const COMPLETION_FIELDS = ['phone', 'location', 'bio', 'department'];

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const enrolledCourses = user?.enrolledCourses || [];
  const completedCourses = user?.completedCourses || [];
  const featuredCourse = enrolledCourses[0];

  const missingFields = COMPLETION_FIELDS.filter((f) => !user?.[f]?.trim());
  const completionPercent = Math.round(((COMPLETION_FIELDS.length - missingFields.length) / COMPLETION_FIELDS.length) * 100);
  const profileIncomplete = missingFields.length > 0;

  // Certificate modal
  const [certModal, setCertModal] = React.useState({ open: false, course: null });

  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dismissed-announcements') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    api.get('/announcements').then(({ data }) => setAnnouncements(data)).catch(() => {});
  }, []);

  const visibleAnnouncements = announcements.filter((a) => !dismissedIds.includes(a._id));

  const dismissAnnouncement = (id) => {
    const next = [...dismissedIds, id];
    setDismissedIds(next);
    localStorage.setItem('dismissed-announcements', JSON.stringify(next));
  };

  return (
    <DashboardLayout
      title="Student Dashboard"
      description="Track your enrolled courses, learning pace, and overall progress."
    >
      {/* Certificate modal */}
      <CertificateModal
        isOpen={certModal.open}
        onClose={() => setCertModal({ open: false, course: null })}
        studentName={user?.name || 'Student'}
        courseTitle={certModal.course?.title || ''}
        completedAt={
          certModal.course
            ? completedCourses.find((c) => c.courseId === certModal.course._id)?.completedAt
            : null
        }
      />

      {/* Announcements from admin — dismissible */}
      <AnimatePresence>
        {visibleAnnouncements.map((ann) => {
          const styles = {
            info: 'border-sky-200 bg-sky-50 dark:border-sky-500/20 dark:bg-sky-500/10 text-sky-800 dark:text-sky-200',
            success: 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-200',
            warning: 'border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10 text-amber-800 dark:text-amber-200',
          };
          const dotColor = { info: 'bg-sky-500', success: 'bg-emerald-500', warning: 'bg-amber-500' };
          return (
            <motion.div
              key={ann._id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`mb-3 flex items-start gap-3 rounded-[22px] border px-4 py-3 ${styles[ann.type] || styles.info}`}
            >
              <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor[ann.type] || dotColor.info}`} />
              <Bell size={16} className="mt-0.5 shrink-0 opacity-60" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{ann.title}</p>
                <p className="mt-0.5 text-sm opacity-80">{ann.body}</p>
                <p className="mt-1 text-xs opacity-50">
                  From {ann.author} · {new Date(ann.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <button type="button" onClick={() => dismissAnnouncement(ann._id)} className="shrink-0 opacity-50 hover:opacity-100">
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Profile completion nudge — only shown when fields are missing */}
      {profileIncomplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel mb-4 rounded-[24px] p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-500 p-2 text-white">
                <UserCircle2 size={18} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Complete your profile — {completionPercent}% done
                </p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {missingFields.length} field{missingFields.length !== 1 ? 's' : ''} still missing:{' '}
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {missingFields.join(', ')}
                  </span>
                </p>
              </div>
            </div>
            <Link
              to="/profile"
              className="shrink-0 rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Complete now →
            </Link>
          </div>
          {/* Mini progress bar */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full rounded-full bg-amber-500"
            />
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={GraduationCap} label="Enrolled Courses" value={enrolledCourses.length} />
        <StatCard
          icon={TrendingUp}
          label="Completion Rate"
          value={`${user?.completionRate || 0}%`}
          accent="from-emerald-500 to-teal-400"
        />
        <StatCard
          icon={CheckCircle2}
          label="Certificates Earned"
          value={completedCourses.length}
          accent="from-violet-500 to-purple-400"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel overflow-hidden rounded-[28px]"
        >
          <div className="relative h-72">
            <img
              src={featuredCourse?.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80'}
              alt={featuredCourse?.title || 'Start learning'}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
            <div className="absolute inset-0 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Learning Spotlight</p>
              <h3 className="mt-4 max-w-xl text-3xl font-semibold leading-tight">
                {featuredCourse?.title || 'Your learning journey starts here.'}
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">
                {featuredCourse?.description ||
                  'Enroll in a course from the catalog to see it featured here and start tracking your progress.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  featuredCourse?.category || user?.department || 'Get started',
                  featuredCourse?.duration || null,
                  `${enrolledCourses.length} active enrollment${enrolledCourses.length !== 1 ? 's' : ''}`,
                ].filter(Boolean).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur"
                  >
                    {item}
                  </span>
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
          <p className="text-sm text-brand-500">Performance</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            Student snapshot
          </h3>

          <div className="mt-6 space-y-4">
            {[
              { label: 'Attendance', value: `${user?.attendance || 0}%`, icon: Sparkles },
              { label: 'Department', value: user?.department || 'Not set', icon: BookMarked },
              { label: 'Role', value: user?.role?.toUpperCase() || 'STUDENT', icon: Award },
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
                    <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[28px] p-6"
        >
          <p className="text-sm text-brand-500">Your courses</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            Enrolled learning tracks
          </h3>

          <div className="mt-5 space-y-4">
            {enrolledCourses.length ? (
              enrolledCourses.map((course, index) => {
                const isDone = completedCourses.some((c) => c.courseId === course._id);
                return (
                <div
                  key={course._id}
                  className={`rounded-3xl border p-4 ${
                    isDone
                      ? 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-500/20 dark:bg-emerald-500/5'
                      : 'border-white/30 bg-white/60 dark:border-white/10 dark:bg-slate-900/50'
                  }`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                        Module {index + 1}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {course.title}
                        </h4>
                        {isDone && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                            <CheckCircle2 size={10} />
                            Done
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Instructor: {course.instructor}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-300">
                        {course.duration}
                      </span>
                      {isDone && (
                        <button
                          type="button"
                          onClick={() => setCertModal({ open: true, course })}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-600"
                        >
                          <Award size={11} />
                          Certificate
                        </button>
                      )}
                      {!isDone && (
                        <button
                          type="button"
                          onClick={() => navigate(`/courses/${course._id}`)}
                          className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900"
                        >
                          Continue →
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {course.description}
                  </p>
                </div>
                );
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
                  No courses enrolled yet
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Visit the courses page to start building your learning plan.
                </p>
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-panel rounded-[28px] p-6"
        >
          <p className="text-sm text-brand-500">Profile highlights</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            Your identity at a glance
          </h3>

          <div className="mt-6 flex items-center gap-4 rounded-[28px] bg-slate-900 p-4 text-white dark:bg-slate-950">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} className="h-20 w-20 rounded-[24px] object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-brand-500 text-3xl font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <p className="text-2xl font-semibold">{user?.name}</p>
              <p className="mt-1 text-sm text-white/70">{user?.title || user?.role || 'Student'}</p>
              <p className="mt-2 text-sm text-brand-200">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {[
              ['Location', user?.location || 'Not set'],
              ['Department', user?.department || 'Not set'],
              ['Total enrollments', String(enrolledCourses.length)],
              ['Certificates earned', String(completedCourses.length)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/20 bg-white/50 p-4 dark:border-white/10 dark:bg-slate-900/50"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
                <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
