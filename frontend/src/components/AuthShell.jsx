import { motion } from 'framer-motion';
import { GraduationCap, ImageIcon, Sparkles, Star } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const defaultStats = [
  { label: 'Experience', value: 'Premium UI' },
  { label: 'Roles', value: 'Student + Admin' },
  { label: 'Flow', value: 'Demo Ready' },
];

const AuthShell = ({
  title,
  subtitle,
  children,
  asideTitle,
  asideText,
  heroImage,
  heroBadge,
  heroStats = defaultStats,
}) => (
  <div className="min-h-screen bg-hero-grid px-4 py-6 dark:bg-hero-grid-dark md:px-6">
    <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel relative flex flex-col justify-between overflow-hidden rounded-[32px] p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(74,104,242,0.24),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.16),transparent_28%)]" />

        <div className="flex items-center justify-between">
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-500">Campus Suite</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">Student Portal</h1>
          </div>
          <ThemeToggle />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="overflow-hidden rounded-[30px] border border-white/20 bg-slate-900 text-white shadow-soft">
            <div className="relative h-64">
              {heroImage ? (
                <img src={heroImage} alt="Portal experience" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-600 via-slate-900 to-slate-700">
                  <ImageIcon size={48} className="text-white/60" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur">
                <Sparkles size={14} />
                {heroBadge || 'Student experience reimagined'}
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Campus Intelligence</p>
                  <p className="mt-2 max-w-sm text-2xl font-semibold leading-tight">
                    Modern onboarding, polished visuals, and realistic learning workflows.
                  </p>
                </div>
                <div className="hidden rounded-2xl bg-white/10 p-3 backdrop-blur sm:block">
                  <GraduationCap size={22} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">{asideTitle}</h2>
            <p className="mt-3 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
              {asideText}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {heroStats.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-3xl border border-white/20 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/50"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Role-based access', 'Students and admins each land in purpose-built spaces'],
              ['Demo seeded content', 'Mock users, analytics, and courses live inside the codebase'],
              ['Premium visuals', 'Images, glow surfaces, strong hierarchy, and smooth motion'],
              ['Responsive workflow', 'Optimized for onboarding, browsing, assigning, and editing'],
            ].map(([heading, text], index) => (
              <div
                key={heading}
                className="rounded-3xl border border-white/20 bg-white/50 p-4 dark:border-white/10 dark:bg-slate-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-900 p-2.5 text-white dark:bg-white dark:text-slate-900">
                    {index % 2 === 0 ? <Star size={16} /> : <Sparkles size={16} />}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{heading}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel rounded-[32px] p-8"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </div>
  </div>
);

export default AuthShell;
