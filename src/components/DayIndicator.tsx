import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export function DayIndicator() {
  const { conflictDay } = useStore();

  return (
    <AnimatePresence>
      {conflictDay > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-6 left-6 z-50"
        >
          <div className="text-[10px] font-mono text-text-muted/50">
            Day {conflictDay}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
