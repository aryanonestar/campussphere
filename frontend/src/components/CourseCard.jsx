import { Award, CheckCircle2, Clock3, PlayCircle, SignalHigh, Star, Trash2, UserRoundPen, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({
  course,
  isAdmin,
  isEnrolled,
  isCompleted,
  onEnroll,
  onDelete,
  onEdit,
  onViewCertificate,
  actionLoading,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel flex h-full flex-col overflow-hidden rounded-[28px]"
    >
      {/* Card image */}
      <div className="relative h-44 overflow-hidden">
        <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-t ${course.accent || 'from-slate-900'} opacity-70`} />

        {/* Category / level chips */}
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {course.category || 'Course'}
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {course.level || 'Open'}
          </span>
        </div>

        {/* ✓ Completed badge — top right */}
        {isCompleted && (
          <div className="absolute right-4 top-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              <CheckCircle2 size={11} />
              Completed
            </span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Instructor</p>
            <h3 className="mt-2 text-xl font-semibold">{course.title}</h3>
            <p className="mt-1 text-sm text-white/80">{course.instructor}</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-2 text-right text-sm backdrop-blur">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-current" />
              <span>{course.rating || '4.8'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {course.description}
        </p>

        {/* Meta chips */}
        <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-slate-500 dark:text-slate-400">
          <div className="rounded-2xl border border-white/20 bg-white/50 px-3 py-3 dark:border-white/10 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <Clock3 size={15} />
              <span>{course.duration}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/50 px-3 py-3 dark:border-white/10 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <SignalHigh size={15} />
              <span>{course.lessons || 24} lessons</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/50 px-3 py-3 dark:border-white/10 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <Users size={15} />
              <span>{course.enrolledCount || course.seats || 40}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex flex-wrap gap-3">
          {/* Open course — always visible */}
          <button
            type="button"
            onClick={() => navigate(`/courses/${course._id}`)}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <PlayCircle size={16} />
            Open course
          </button>

          {isAdmin ? (
            <>
              <button type="button" onClick={() => onEdit(course)} className="secondary-btn gap-2">
                <UserRoundPen size={16} />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(course._id)}
                disabled={actionLoading}
                className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-70"
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 size={16} />
                  Delete
                </span>
              </button>
            </>
          ) : isCompleted ? (
            /* Certificate button when completed */
            <button
              type="button"
              onClick={() => onViewCertificate?.(course)}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <Award size={16} />
              Certificate
            </button>
          ) : (
            /* Enroll button when not yet enrolled/completed */
            <button
              type="button"
              onClick={() => onEnroll(course._id)}
              disabled={isEnrolled || actionLoading}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isEnrolled
                  ? 'cursor-not-allowed bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  : 'bg-brand-500 text-white hover:bg-brand-600'
              }`}
            >
              {isEnrolled ? 'Already enrolled' : 'Enroll now'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
