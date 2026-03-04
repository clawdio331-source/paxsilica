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
        <div className="max-w-2xl w-full text-center">
          <div className="text-[10px] uppercase tracking-[0.3em] text-text-muted mb-2">
            Checkpoint — Day {day}
          </div>
          <h2 className="font-heading text-2xl mb-4 text-text-primary">{title}</h2>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              currentChoice === 1
                ? 'bg-accent-red/10 border border-accent-red/30 text-accent-red'
                : 'bg-accent-green/10 border border-accent-green/30 text-accent-green'
            }`}
          >
            <span className="text-xs opacity-60">You chose:</span>
            {chosen.label}
          </div>
          <button
            onClick={() => {
              setActiveCheckpoint(day);
            }}
            className="block mx-auto mt-4 text-xs text-text-muted hover:text-accent-teal transition-colors cursor-pointer"
          >
            Change decision
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
            className="absolute inset-0 bg-bg-primary/60 backdrop-blur-sm z-10"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: false, amount: 0.5 }}
        className="relative z-20 max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-accent-teal/40" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent-teal font-medium">
              Checkpoint — Day {day}
            </span>
            <div className="h-px w-8 bg-accent-teal/40" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl mb-3 text-text-primary">{title}</h2>
          <p className="text-text-secondary text-sm max-w-lg mx-auto leading-relaxed">{subtitle}</p>
        </div>

        {/* Choice buttons */}
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { option: optionA, value: 0 as const, side: 'de-escalation' },
            { option: optionB, value: 1 as const, side: 'escalation' },
          ].map(({ option, value, side }) => (
            <motion.button
              key={value}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setCheckpointChoice(storeKey, value);
              }}
              className={`group relative text-left p-6 md:p-8 rounded-xl border cursor-pointer transition-all duration-300 ${
                side === 'de-escalation'
                  ? 'border-accent-green/20 hover:border-accent-green/50 hover:bg-accent-green/5'
                  : 'border-accent-red/20 hover:border-accent-red/50 hover:bg-accent-red/5'
              }`}
            >
              {/* Tag */}
              <div
                className={`text-[9px] uppercase tracking-[0.2em] font-semibold mb-3 ${
                  side === 'de-escalation' ? 'text-accent-green' : 'text-accent-red'
                }`}
              >
                Option {value === 0 ? 'A' : 'B'}
              </div>

              <h3 className="font-heading text-xl md:text-2xl mb-3 text-text-primary">
                {option.label}
              </h3>

              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                {option.description}
              </p>

              {/* Impact note */}
              <div className="text-[11px] text-text-muted border-t border-border-subtle pt-3 mt-auto">
                <span className="font-semibold text-text-secondary">Impact: </span>
                {option.impact}
              </div>

              {/* Arrow indicator */}
              <div
                className={`absolute top-6 right-6 w-8 h-8 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                  side === 'de-escalation'
                    ? 'border-accent-green/40 text-accent-green'
                    : 'border-accent-red/40 text-accent-red'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1L13 7L7 13M13 7H1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
