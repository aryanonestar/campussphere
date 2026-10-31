import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, accent = 'from-brand-500 to-sky-400' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-panel rounded-[28px] p-5"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
      <div className={`rounded-2xl bg-gradient-to-br ${accent} p-4 text-white`}>
        <Icon size={22} />
      </div>
    </div>
  </motion.div>
);

export default StatCard;

