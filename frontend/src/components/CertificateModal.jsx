import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Award } from 'lucide-react';

/**
 * Formats a date string into "Month DD, YYYY"
 */
const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * Downloads the certificate div as a PNG using the Canvas API.
 * Works entirely in-browser — no external library needed.
 */
const downloadCertificate = async (certRef, studentName, courseTitle) => {
  if (!certRef.current) return;

  try {
    // Dynamically import html2canvas only when needed
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });
    const link = document.createElement('a');
    link.download = `${studentName.replace(/\s+/g, '_')}_${courseTitle.replace(/\s+/g, '_')}_Certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch {
    // Fallback: print the page if html2canvas not available
    window.print();
  }
};

const CertificateModal = ({ isOpen, onClose, studentName, courseTitle, completedAt }) => {
  const certRef = useRef(null);
  const date = completedAt ? formatDate(completedAt) : formatDate(new Date().toISOString());

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action bar */}
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-white/70">
                🎓 Certificate of Completion
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadCertificate(certRef, studentName, courseTitle)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  <Download size={15} />
                  Download PNG
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl bg-white/10 p-2 text-white transition hover:bg-white/20"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ─── Certificate card ─── */}
            <div
              ref={certRef}
              className="relative overflow-hidden rounded-[32px] bg-white"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {/* Top gradient strip */}
              <div className="h-3 w-full bg-gradient-to-r from-brand-500 via-violet-500 to-sky-400" />

              {/* Decorative corner accents */}
              <div className="pointer-events-none absolute left-4 top-4 h-20 w-20 rounded-full border-4 border-brand-100 opacity-40" />
              <div className="pointer-events-none absolute bottom-4 right-4 h-28 w-28 rounded-full border-4 border-violet-100 opacity-40" />
              <div className="pointer-events-none absolute right-6 top-6 h-12 w-12 rounded-full border-2 border-sky-200 opacity-30" />

              <div className="px-12 py-10 text-center">
                {/* Badge */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 shadow-lg shadow-brand-200">
                  <Award size={38} className="text-white" />
                </div>

                {/* Title text */}
                <p
                  className="text-xs uppercase tracking-[0.35em] text-slate-400"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  This is to certify that
                </p>

                {/* Student name */}
                <h2
                  className="mt-3 text-4xl font-bold text-slate-900"
                  style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}
                >
                  {studentName}
                </h2>

                {/* Decorative divider */}
                <div className="mx-auto my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-200" />
                  <div className="h-2 w-2 rounded-full bg-brand-400" />
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-200" />
                </div>

                <p
                  className="text-sm text-slate-500"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  has successfully completed the course
                </p>

                {/* Course title */}
                <h3
                  className="mt-3 text-2xl font-semibold text-brand-600"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {courseTitle}
                </h3>

                {/* Date */}
                <p
                  className="mt-6 text-sm text-slate-400"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  Awarded on <span className="font-semibold text-slate-600">{date}</span>
                </p>

                {/* Signature line */}
                <div className="mt-8 flex items-end justify-center gap-16">
                  <div className="text-center">
                    <div className="mb-1 h-px w-32 bg-slate-300" />
                    <p className="text-xs text-slate-400" style={{ fontFamily: 'system-ui, sans-serif' }}>
                      Programme Director
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 h-px w-32 bg-slate-300" />
                    <p className="text-xs text-slate-400" style={{ fontFamily: 'system-ui, sans-serif' }}>
                      CampusSphere Portal
                    </p>
                  </div>
                </div>

                {/* Portal branding footer */}
                <div className="mt-8 flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-brand-500" />
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                  >
                    Elevate Campus · CampusSphere
                  </p>
                  <div className="h-2 w-2 rounded-full bg-brand-500" />
                </div>
              </div>

              {/* Bottom gradient strip */}
              <div className="h-3 w-full bg-gradient-to-r from-sky-400 via-violet-500 to-brand-500" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal;
