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
    <div className="my-8 py-6 border-t border-border-subtle">
      <h4 className="font-heading text-lg mb-4 text-text-primary">
        Where the $710B Is Flowing
      </h4>

      {/* Stacked bar */}
      <div className="relative h-6 flex overflow-hidden">
        <motion.div
          className="h-full bg-white/15 flex items-center justify-center"
          animate={{ width: `${deployedPct}%` }}
          transition={{ duration: 0.6 }}
        >
          {deployedPct > 15 && (
            <span className="text-[9px] font-mono text-white/60 whitespace-nowrap px-1">
              HW ${deployedAmt}B
            </span>
          )}
        </motion.div>
        <motion.div
          className="h-full bg-white/[0.05] flex items-center justify-center"
          animate={{ width: `${strandedPct}%` }}
          transition={{ duration: 0.6 }}
        >
          {strandedPct > 12 && (
            <span className="text-[9px] font-mono text-white/40 whitespace-nowrap px-1">
              Stranded ${strandedAmt}B
            </span>
          )}
        </motion.div>
        <motion.div
          className="h-full bg-white/10 flex items-center justify-center"
          animate={{ width: `${Math.max(rotationPct, 0)}%` }}
          transition={{ duration: 0.6 }}
        >
          {rotationPct > 5 && (
            <span className="text-[9px] font-mono text-white/60 whitespace-nowrap px-1">
              SW ${rotationAmt}B
            </span>
          )}
        </motion.div>
      </div>

      {/* Legend */}
      <div className="flex gap-5 mt-3">
        {[
          { label: 'Hardware', value: `${deployedPct.toFixed(0)}%` },
          { label: 'Stranded', value: `${strandedPct.toFixed(0)}%` },
          { label: 'Software', value: `${rotationPct.toFixed(1)}%` },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="text-[10px] text-text-muted">{item.label}</span>
            <span className="text-[10px] font-mono text-text-secondary">{item.value}</span>
          </div>
        ))}
      </div>

      {conflictDay > 30 && rotationPct > 2 && (
        <p className="mt-3 text-[13px] text-text-muted leading-[1.7]">
          {rotationPct > 15
            ? 'Hardware capex is severely stuck. Capital is rotating aggressively into software — inference optimization, tooling, workload orchestration.'
            : rotationPct > 5
              ? 'Procurement delays are forcing budget reallocation. Software and optimization spend is absorbing stranded hardware capex.'
              : 'Early signs of capital rotation. Companies redirecting modest budget to software while hardware procurement stalls.'}
        </p>
      )}
    </div>
  );
}
