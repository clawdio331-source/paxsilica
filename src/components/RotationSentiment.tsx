import { useStore } from '../store/useStore';
import { rotationWindowStatus, rotationWindowEnd } from '../lib/metrics';
import { motion } from 'framer-motion';

export function RotationSentimentCard({ checkpointDay }: { checkpointDay: 90 | 120 }) {
  const { conflictDay, escalationIndex, metrics } = useStore();
  const status = rotationWindowStatus(conflictDay, escalationIndex);
  const windowEnd = rotationWindowEnd(escalationIndex);
  const daysRemaining = Math.max(0, windowEnd - conflictDay);
  const rotation = metrics.softwareRotation;
  const stranded = metrics.gap;

  const statusText = {
    NOT_OPEN: 'not yet open',
    OPEN: 'open',
    PEAKING: 'at peak',
    CLOSING: 'closing',
    CLOSED: 'closed',
  }[status];

  const igvSentiment = rotation > 15
    ? 'benefitting significantly'
    : rotation > 5
      ? 'benefitting'
      : rotation > 2
        ? 'seeing early demand'
        : 'plateauing';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="border-l border-border-subtle pl-5 py-3 mt-4 max-w-2xl mx-auto"
    >
      {checkpointDay === 90 ? (
        <p className="text-[13px] text-text-secondary leading-[1.7]">
          Under your scenario, the software rotation window is currently{' '}
          <span className="text-text-primary">{statusText}</span>.
          Capital is flowing to software at{' '}
          <span className="font-mono text-text-primary">{rotation.toFixed(1)}%</span> of total
          committed capex. IGV-type names are {igvSentiment}.
        </p>
      ) : (
        <p className="text-[13px] text-text-secondary leading-[1.7]">
          Under your scenario,{' '}
          <span className="font-mono text-text-primary">${stranded}B</span> of the original $710B
          is stranded. Of the stranded capex,{' '}
          <span className="font-mono text-text-primary">{rotation.toFixed(1)}%</span> has rotated
          to software. The rotation window{' '}
          <span className="text-text-primary">
            {status === 'CLOSED'
              ? 'has closed'
              : status === 'PEAKING'
                ? 'is at peak'
                : `has ${daysRemaining} days remaining`}
          </span>. Beyond this point, prolonged hardware stagnation begins to cap software upside.
        </p>
      )}
    </motion.div>
  );
}
