import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, BookOpen, CheckCircle2, Clock3, Link2, PlayCircle, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import Loader from '../components/Loader';
import CertificateModal from '../components/CertificateModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [completedAt, setCompletedAt] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      toast.success('Course link copied!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error('Could not copy link.'));
  };

  const isAdmin = user?.role === 'admin';

  const isEnrolled = (user?.enrolledCourses || []).some(
    (c) => (c._id || c) === id
  );

  const completionRecord = (user?.completedCourses || []).find(
    (c) => c.courseId === id
  );
  const isCompleted = Boolean(completionRecord);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
      } catch {
        toast.error('Course not found.');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // If already completed before page load, capture the stored date
  useEffect(() => {
    if (completionRecord?.completedAt) {
      setCompletedAt(completionRecord.completedAt);
    }
  }, [completionRecord]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post('/users/enroll', { courseId: id });
      await refreshProfile();
      toast.success('Enrolled successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleMarkComplete = async () => {
    setCompleting(true);
    try {
      const { data } = await api.post('/users/mark-complete', { courseId: id });
      await refreshProfile();
      setCompletedAt(data.completedAt);
      toast.success('Course marked as complete! 🎉');
      // Small delay so the toast is visible before the modal pops
      setTimeout(() => setCertOpen(true), 600);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not mark course complete.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Course" description="Loading course content...">
        <div className="glass-panel rounded-[28px]">
          <Loader label="Fetching course..." />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) return null;

  const embedSrc = course.playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${course.playlistId}&rel=0&modestbranding=1`
    : null;

  return (
    <DashboardLayout
      title={course.title}
      description={`${course.category || 'Course'} · ${course.level || 'Open'} · ${course.duration}`}
    >
      {/* Certificate modal */}
      <CertificateModal
        isOpen={certOpen}
        onClose={() => setCertOpen(false)}
        studentName={user?.name || 'Student'}
        courseTitle={course.title}
        completedAt={completedAt}
      />

      {/* Back + Share row */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="secondary-btn inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to catalog
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            copied
              ? 'bg-emerald-500 text-white'
              : 'border border-white/20 bg-white/60 text-slate-700 hover:bg-white/90 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200'
          }`}
        >
          <Link2 size={15} />
          {copied ? 'Copied!' : 'Share course'}
        </button>
      </div>

      {/* Completion banner — shown when already completed */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex flex-col gap-3 rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-500/20 dark:bg-emerald-500/10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={22} className="shrink-0 text-emerald-500" />
            <div>
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                You've completed this course!
              </p>
              {completedAt && (
                <p className="mt-0.5 text-sm text-emerald-600 dark:text-emerald-400">
                  Completed on{' '}
                  {new Date(completedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCertOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            <Award size={15} />
            View certificate
          </button>
        </motion.div>
      )}

      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel overflow-hidden rounded-[28px]"
      >
        <div className="relative h-56 md:h-72">
          <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${course.accent || 'from-slate-900'} opacity-80`} />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                {course.category || 'Course'}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                {course.level || 'Open'}
              </span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold">
                  <CheckCircle2 size={11} />
                  Completed
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold leading-tight">{course.title}</h1>
            <p className="mt-2 text-sm text-white/80">Instructor: {course.instructor}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 gap-3 p-5 md:grid-cols-4">
          {[
            { icon: Clock3, label: 'Duration', value: course.duration },
            { icon: BookOpen, label: 'Lessons', value: `${course.lessons || 24} lessons` },
            { icon: Users, label: 'Seats', value: `${course.seats || 40} seats` },
            { icon: Star, label: 'Rating', value: `${course.rating || '4.8'} / 5` },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/20 bg-white/50 px-4 py-3 dark:border-white/10 dark:bg-slate-900/50"
            >
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Icon size={15} />
                <span className="text-xs uppercase tracking-wide">{label}</span>
              </div>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Description + action buttons */}
        <div className="flex flex-col gap-4 px-5 pb-5 md:flex-row md:items-start md:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            {course.description}
          </p>

          {!isAdmin && (
            <div className="flex shrink-0 flex-col gap-2">
              {/* Enroll button */}
              <button
                type="button"
                onClick={handleEnroll}
                disabled={isEnrolled || enrolling}
                className={`rounded-2xl px-6 py-3 text-sm font-semibold transition ${
                  isEnrolled
                    ? 'cursor-not-allowed bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    : 'bg-brand-500 text-white hover:bg-brand-600'
                }`}
              >
                {isEnrolled ? '✓ Enrolled' : enrolling ? 'Enrolling…' : 'Enroll now'}
              </button>

              {/* Mark complete button — only when enrolled and not yet completed */}
              {isEnrolled && !isCompleted && (
                <button
                  type="button"
                  onClick={handleMarkComplete}
                  disabled={completing}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  <Award size={15} />
                  {completing ? 'Saving…' : 'Mark as complete'}
                </button>
              )}

              {/* View certificate button — when already completed */}
              {isCompleted && (
                <button
                  type="button"
                  onClick={() => setCertOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  <Award size={15} />
                  View certificate
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* YouTube embedded playlist */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel mt-4 overflow-hidden rounded-[28px]"
      >
        <div className="flex items-center gap-3 p-5 pb-0">
          <div className="rounded-2xl bg-red-600 p-2 text-white">
            <PlayCircle size={20} />
          </div>
          <div>
            <p className="text-sm text-brand-500">Course content</p>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Watch the full playlist
            </h2>
          </div>
        </div>

        {embedSrc ? (
          <div className="mt-4 px-5 pb-5">
            <div
              className="relative w-full overflow-hidden rounded-[20px]"
              style={{ paddingBottom: '56.25%' }}
            >
              <iframe
                src={embedSrc}
                title={`${course.title} — YouTube Playlist`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              Content sourced from YouTube. Use the playlist icon (☰) inside the player to navigate between videos.
            </p>

            {/* Inline CTA after watching */}
            {isEnrolled && !isCompleted && (
              <div className="mt-4 flex items-center gap-4 rounded-[20px] border border-white/20 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/50">
                <Award size={20} className="shrink-0 text-brand-500" />
                <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">
                  Finished watching? Mark the course complete to earn your certificate.
                </p>
                <button
                  type="button"
                  onClick={handleMarkComplete}
                  disabled={completing}
                  className="shrink-0 rounded-2xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
                >
                  {completing ? 'Saving…' : 'Get certificate'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-5 mb-5 mt-4 rounded-[20px] border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <PlayCircle size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="font-medium text-slate-600 dark:text-slate-300">No playlist added yet</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              An admin can add a YouTube playlist link when editing this course.
            </p>
          </div>
        )}
      </motion.section>
    </DashboardLayout>
  );
};

export default CoursePage;
