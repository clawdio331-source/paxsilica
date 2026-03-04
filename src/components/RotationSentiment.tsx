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
    OPEN: 'OPEN',
    PEAKING: 'at PEAK',
    CLOSING: 'CLOSING',
    CLOSED: 'CLOSED',
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
      className="bg-accent-blue/5 border border-accent-blue/20 rounded-lg p-4 mt-4 max-w-2xl mx-auto"
    >
      <div className="text-[9px] uppercase tracking-[0.2em] text-accent-blue font-semibold mb-2">
        Capital Rotation Status — Day {checkpointDay}
      </div>

      {checkpointDay === 90 ? (
        <p className="text-xs text-text-secondary leading-relaxed">
          Under your scenario, the software rotation window is currently{' '}
          <span className={`font-semibold ${
            status === 'PEAKING' ? 'text-accent-teal' :
            status === 'OPEN' ? 'text-accent-green' :
            status === 'CLOSING' ? 'text-accent-amber' : 'text-text-muted'
          }`}>
            {statusText}
          </span>
          . Capital is flowing to software at{' '}
          <span className="font-mono text-accent-blue">{rotation.toFixed(1)}%</span> of total
          committed capex. IGV-type names are{' '}
          <span className="font-semibold text-text-primary">{igvSentiment}</span>.
        </p>
      ) : (
        <p className="text-xs text-text-secondary leading-relaxed">
          Under your scenario,{' '}
          <span className="font-mono text-accent-red">${stranded}B</span> of the original $710B
          is stranded. Of the stranded capex,{' '}
          <span className="font-mono text-accent-blue">{rotation.toFixed(1)}%</span> has rotated
          to software. The rotation window{' '}
          <span className={`font-semibold ${
            status === 'CLOSED' ? 'text-accent-red' :
            status === 'PEAKING' ? 'text-accent-teal' : 'text-text-primary'
          }`}>
            {status === 'CLOSED'
              ? 'has closed'
              : status === 'PEAKING'
                ? 'is at peak'
                : `has ${daysRemaining} days remaining`}
          </span>
          . Beyond this point, prolonged hardware stagnation begins to cap software upside.
        </p>
      )}
    </motion.div>
  );
}
