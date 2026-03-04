import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import {
  softwareRotationIndex,
  rotationWindowStart,
  rotationWindowPeak,
  rotationWindowEnd,
  rotationWindowStatus,
  igvImpliedMultiplier,
} from '../lib/metrics';

export function RotationCalculator() {
  const { conflictDay, escalationIndex, metrics } = useStore();
  const [totalCapex, setTotalCapex] = useState(710);
  const [absorptionRate, setAbsorptionRate] = useState(15);

  const rotation = metrics.softwareRotation;
  const stranded = totalCapex * (1 - metrics.capexRate / 100) * (conflictDay / 360);
  const rotatedAmt = stranded * (rotation / 100) * (absorptionRate / 100);
  const windowStatus = rotationWindowStatus(conflictDay, escalationIndex);
  const windowStart = rotationWindowStart(escalationIndex);
  const windowEndDay = rotationWindowEnd(escalationIndex);
  const daysRemaining = Math.max(0, windowEndDay - conflictDay);
  const igvMult = igvImpliedMultiplier(conflictDay, escalationIndex);

  const statusColors: Record<string, string> = {
    NOT_OPEN: 'text-text-muted',
    OPEN: 'text-accent-green',
    PEAKING: 'text-accent-teal',
    CLOSING: 'text-accent-amber',
    CLOSED: 'text-accent-red',
  };

  const statusLabels: Record<string, string> = {
    NOT_OPEN: 'WINDOW NOT YET OPEN',
    OPEN: 'WINDOW OPEN',
    PEAKING: 'WINDOW AT PEAK',
    CLOSING: 'WINDOW CLOSING',
    CLOSED: 'WINDOW CLOSED',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      className="bg-bg-elevated/60 border border-border-subtle rounded-xl p-5 md:p-6 my-6"
    >
      <div className="text-[10px] uppercase tracking-[0.2em] text-accent-blue mb-3 font-medium">
        Interactive Calculator
      </div>
      <h4 className="font-heading text-lg mb-4 text-text-primary">The Rotation Window</h4>

      {/* Status badge */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`text-xs font-mono font-semibold ${statusColors[windowStatus]}`}>
          {statusLabels[windowStatus]}
        </div>
        {windowStatus !== 'CLOSED' && windowStatus !== 'NOT_OPEN' && (
          <span className="text-[10px] text-text-muted">
            {daysRemaining} days remaining
          </span>
        )}
      </div>

      {/* Inputs */}
      <div className="space-y-4 mb-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-text-secondary">Total Planned Capex</label>
            <span className="text-sm font-mono text-accent-teal">${totalCapex}B</span>
          </div>
          <input
            type="range" min={200} max={1000} step={10} value={totalCapex}
            onChange={(e) => setTotalCapex(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-text-secondary">Software Absorption Rate</label>
            <span className="text-sm font-mono text-accent-teal">{absorptionRate}%</span>
          </div>
          <input
            type="range" min={5} max={30} step={1} value={absorptionRate}
            onChange={(e) => setAbsorptionRate(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Outputs */}
      <div className="border-t border-border-subtle pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xl font-heading text-accent-blue">${rotatedAmt.toFixed(1)}B</div>
          <div className="text-[9px] text-text-muted uppercase tracking-wider mt-1">
            Software rotation
          </div>
        </div>
        <div>
          <div className="text-xl font-heading text-text-secondary">
            {Math.max(0, windowEndDay - windowStart)}d
          </div>
          <div className="text-[9px] text-text-muted uppercase tracking-wider mt-1">
            Window duration
          </div>
        </div>
        <div>
          <div className="text-xl font-heading text-accent-amber">{igvMult}x</div>
          <div className="text-[9px] text-text-muted uppercase tracking-wider mt-1">
            IGV revenue uplift
          </div>
        </div>
        <div>
          <div className="text-xl font-heading text-accent-green">{rotation.toFixed(1)}%</div>
          <div className="text-[9px] text-text-muted uppercase tracking-wider mt-1">
            Current rotation
          </div>
        </div>
      </div>
    </motion.div>
  );
}
