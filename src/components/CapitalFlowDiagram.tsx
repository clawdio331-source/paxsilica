import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export function CapitalFlowDiagram() {
  const { metrics, conflictDay } = useStore();
  const totalCapex = 710;

  const deployedPct = metrics.capexRate;
  const strandedPct = Math.max(0, 100 - deployedPct - metrics.softwareRotation);
  const rotationPct = metrics.softwareRotation;

  const deployedAmt = Math.round(totalCapex * deployedPct / 100);
  const strandedAmt = Math.round(totalCapex * strandedPct / 100);
  const rotationAmt = Math.round(totalCapex * rotationPct / 100);

  return (
    <div className="bg-bg-elevated/60 border border-border-subtle rounded-xl p-5 md:p-6 my-6">
      <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-1">
        Capital Allocation
      </div>
      <h4 className="font-heading text-lg mb-4 text-text-primary">
        Where the $710B Is Flowing
      </h4>

      {/* Stacked bar */}
      <div className="relative h-10 rounded-lg overflow-hidden flex">
        <motion.div
          className="h-full bg-accent-green/70 flex items-center justify-center"
          animate={{ width: `${deployedPct}%` }}
          transition={{ duration: 0.6 }}
        >
          {deployedPct > 15 && (
            <span className="text-[10px] font-medium text-white/90 whitespace-nowrap px-1">
              Hardware ${deployedAmt}B
            </span>
          )}
        </motion.div>
        <motion.div
          className="h-full bg-text-muted/30 flex items-center justify-center"
          animate={{ width: `${strandedPct}%` }}
          transition={{ duration: 0.6 }}
        >
          {strandedPct > 12 && (
            <span className="text-[10px] font-medium text-white/70 whitespace-nowrap px-1">
              Stranded ${strandedAmt}B
            </span>
          )}
        </motion.div>
        <motion.div
          className="h-full bg-accent-blue/70 flex items-center justify-center"
          animate={{ width: `${Math.max(rotationPct, 0)}%` }}
          transition={{ duration: 0.6 }}
        >
          {rotationPct > 5 && (
            <span className="text-[10px] font-medium text-white/90 whitespace-nowrap px-1">
              Software ${rotationAmt}B
            </span>
          )}
        </motion.div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        {[
          { color: 'bg-accent-green/70', label: 'Deployed Hardware', value: `${deployedPct.toFixed(0)}%` },
          { color: 'bg-text-muted/30', label: 'Stranded / Queued', value: `${strandedPct.toFixed(0)}%` },
          { color: 'bg-accent-blue/70', label: 'Software Rotation', value: `${rotationPct.toFixed(1)}%` },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
            <span className="text-[10px] text-text-muted">{item.label}</span>
            <span className="text-[10px] font-mono text-text-secondary">{item.value}</span>
          </div>
        ))}
      </div>

      {conflictDay > 30 && rotationPct > 2 && (
        <div className="mt-3 text-[11px] text-text-muted border-t border-border-subtle pt-3">
          {rotationPct > 15
            ? 'Hardware capex is severely stuck. Capital is rotating aggressively into software — inference optimization, tooling, workload orchestration.'
            : rotationPct > 5
              ? 'Procurement delays are forcing budget reallocation. Software and optimization spend is absorbing stranded hardware capex.'
              : 'Early signs of capital rotation. Companies redirecting modest budget to software while hardware procurement stalls.'}
        </div>
      )}
    </div>
  );
}
