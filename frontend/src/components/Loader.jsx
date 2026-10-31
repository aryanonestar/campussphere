const Loader = ({ label = 'Loading portal...' }) => (
  <div className="flex min-h-[200px] flex-col items-center justify-center gap-4">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
  </div>
);

export default Loader;

