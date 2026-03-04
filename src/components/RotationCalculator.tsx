import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import {
  rotationWindowStart,
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

  const statusLabels: Record<string, string> = {
    NOT_OPEN: 'not open',
    OPEN: 'open',
    PEAKING: 'peak',
    CLOSING: 'closing',
    CLOSED: 'closed',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      className="my-8 py-6 border-t border-border-subtle"
    >
      <h4 className="font-heading text-lg mb-1 text-text-primary">The Rotation Window</h4>

      <div className="text-[11px] text-text-muted mb-5">
        Window {statusLabels[windowStatus]}
        {windowStatus !== 'CLOSED' && windowStatus !== 'NOT_OPEN' && ` · ${daysRemaining}d remaining`}
      </div>

      <div className="space-y-4 mb-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] text-text-secondary">Total Planned Capex</label>
            <span className="text-[12px] font-mono text-text-primary">${totalCapex}B</span>
          </div>
          <input
            type="range" min={200} max={1000} step={10} value={totalCapex}
            onChange={(e) => setTotalCapex(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] text-text-secondary">Software Absorption Rate</label>
            <span className="text-[12px] font-mono text-text-primary">{absorptionRate}%</span>
          </div>
          <input
            type="range" min={5} max={30} step={1} value={absorptionRate}
            onChange={(e) => setAbsorptionRate(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border-subtle grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xl font-heading text-text-primary">${rotatedAmt.toFixed(1)}B</div>
          <div className="text-[9px] text-text-muted mt-1">Software rotation</div>
        </div>
        <div>
          <div className="text-xl font-heading text-text-secondary">
            {Math.max(0, windowEndDay - windowStart)}d
          </div>
          <div className="text-[9px] text-text-muted mt-1">Window duration</div>
        </div>
        <div>
          <div className="text-xl font-heading text-text-secondary">{igvMult}x</div>
          <div className="text-[9px] text-text-muted mt-1">IGV revenue uplift</div>
        </div>
        <div>
          <div className="text-xl font-heading text-text-primary">{rotation.toFixed(1)}%</div>
          <div className="text-[9px] text-text-muted mt-1">Current rotation</div>
        </div>
      </div>
    </motion.div>
  );
}
