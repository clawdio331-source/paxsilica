import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { CheckpointChoices } from '../lib/metrics';

interface CheckpointProps {
  day: number;
  storeKey: keyof CheckpointChoices;
  title: string;
  subtitle: string;
  optionA: {
    label: string;
    description: string;
    impact: string;
  };
  optionB: {
    label: string;
    description: string;
    impact: string;
  };
}

export function Checkpoint({
  day,
  storeKey,
  title,
  subtitle,
  optionA,
  optionB,
}: CheckpointProps) {
  const { checkpointChoices, setCheckpointChoice, activeCheckpoint, setActiveCheckpoint } = useStore();
  const currentChoice = checkpointChoices[storeKey];
  const isActive = activeCheckpoint === day;

  // If already chosen, show summary
  if (currentChoice !== null && !isActive) {
    const chosen = currentChoice === 0 ? optionA : optionB;
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-xl w-full text-center">
          <div className="text-[10px] font-mono text-text-muted mb-3">Day {day}</div>
          <h2 className="font-heading text-xl mb-4 text-text-primary">{title}</h2>
          <div className="text-sm text-text-secondary">
            <span className="text-text-muted">You chose: </span>
            <span className={currentChoice === 1 ? 'text-accent-red' : 'text-accent-green'}>
              {chosen.label}
            </span>
          </div>
          <button
            onClick={() => setActiveCheckpoint(day)}
            className="mt-4 text-[11px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative" id={`checkpoint-${day}`}>
      {/* Dimmed overlay */}
      <AnimatePresence>
        {(currentChoice === null || isActive) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-bg-primary/70 backdrop-blur-sm z-10"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: false, amount: 0.5 }}
        className="relative z-20 max-w-3xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          {/* Decision badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            viewport={{ once: false }}
            className="inline-flex items-center gap-2 px-4 py-1.5 border border-accent-teal/30 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
            <span className="text-[11px] font-mono text-accent-teal tracking-wide">
              Decision Required
            </span>
          </motion.div>

          <div className="text-[10px] font-mono text-text-muted mb-4">Day {day}</div>
          <h2 className="font-heading text-2xl md:text-3xl mb-3 text-text-primary">{title}</h2>
          <p className="text-text-secondary text-sm max-w-md mx-auto leading-relaxed">{subtitle}</p>

          {/* Arrow hint */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: false }}
            className="mt-6 text-[11px] text-text-muted/60"
          >
            Choose a path to continue
          </motion.div>
        </div>

        {/* Choice buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { option: optionA, value: 0 as const, side: 'de-escalation' },
            { option: optionB, value: 1 as const, side: 'escalation' },
          ].map(({ option, value, side }) => (
            <motion.button
              key={value}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCheckpointChoice(storeKey, value)}
              className={`group text-left p-6 border-2 transition-all duration-200 cursor-pointer ${
                side === 'de-escalation'
                  ? 'border-accent-green/20 hover:border-accent-green/50 hover:bg-accent-green/[0.03]'
                  : 'border-accent-red/20 hover:border-accent-red/50 hover:bg-accent-red/[0.03]'
              }`}
            >
              <div
                className={`text-[9px] font-mono uppercase tracking-wider mb-3 ${
                  side === 'de-escalation' ? 'text-accent-green/70' : 'text-accent-red/70'
                }`}
              >
                {value === 0 ? 'A' : 'B'}
              </div>

              <h3 className="font-heading text-lg mb-2 text-text-primary group-hover:text-white transition-colors">
                {option.label}
              </h3>

              <p className="text-text-secondary text-[13px] leading-relaxed mb-4">
                {option.description}
              </p>

              <div className="text-[11px] text-text-muted border-t border-border-subtle pt-3 group-hover:text-text-secondary transition-colors">
                {option.impact}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
