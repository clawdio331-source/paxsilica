import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { coastalPauseDuration } from '../lib/metrics';

export function InlandShiftCalculator() {
  const { escalationIndex, metrics } = useStore();
  const [totalPipeline, setTotalPipeline] = useState(3300); // MW by 2030
  const [acceleration, setAcceleration] = useState(20);
  const [coastalPause, setCoastalPause] = useState(Math.round(coastalPauseDuration(escalationIndex)));

  const dist = metrics.regionalDist;

  // Revised KSA capacity projections
  const ksaBase2028 = 400; // MW
  const ksaBase2030 = 1100; // MW
  const ksaRevised2028 = Math.round(ksaBase2028 * (1 + acceleration / 100));
  const ksaRevised2030 = Math.round(ksaBase2030 * (1 + acceleration / 100));

  // UAE capacity during/after pause
  const uaeBase2028 = 800;
  const uaeBase2030 = 1200;
  const pauseImpact = Math.min(coastalPause / 360, 0.3); // cap at 30% reduction
  const uaeRevised2028 = Math.round(uaeBase2028 * (1 - pauseImpact * 0.3));
  const uaeRevised2030 = Math.round(uaeBase2030 * (1 - pauseImpact * 0.1)); // recovers by 2030

  const totalBaseline = ksaBase2030 + uaeBase2030 + 200; // +200 for Bahrain/other
  const totalRevised = ksaRevised2030 + uaeRevised2030 + Math.round(200 * (1 + acceleration / 200));
  const growthVsBaseline = ((totalRevised / totalBaseline - 1) * 100).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      className="bg-bg-elevated/60 border border-border-subtle rounded-xl p-5 md:p-6 my-6"
    >
      <div className="text-[10px] uppercase tracking-[0.2em] text-accent-teal mb-3 font-medium">
        Interactive Calculator
      </div>
      <h4 className="font-heading text-lg mb-4 text-text-primary">The Inland Shift</h4>

      <div className="space-y-4 mb-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-text-secondary">Total Gulf Pipeline (MW by 2030)</label>
            <span className="text-sm font-mono text-accent-teal">{totalPipeline} MW</span>
          </div>
          <input
            type="range" min={1000} max={5000} step={100} value={totalPipeline}
            onChange={(e) => setTotalPipeline(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-text-secondary">Conflict-Driven Inland Acceleration</label>
            <span className="text-sm font-mono text-accent-teal">{acceleration}%</span>
          </div>
          <input
            type="range" min={0} max={50} step={5} value={acceleration}
            onChange={(e) => setAcceleration(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-text-secondary">Coastal Buildout Pause Duration</label>
            <span className="text-sm font-mono text-accent-teal">{coastalPause} days</span>
          </div>
          <input
            type="range" min={0} max={180} step={10} value={coastalPause}
            onChange={(e) => setCoastalPause(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="border-t border-border-subtle pt-4">
        {/* Capacity projections */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-[9px] text-text-muted uppercase tracking-wider mb-2">2028 Capacity (MW)</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">KSA</span>
                <span className="font-mono text-accent-teal">{ksaRevised2028}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">UAE</span>
                <span className="font-mono text-accent-green">{uaeRevised2028}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[9px] text-text-muted uppercase tracking-wider mb-2">2030 Capacity (MW)</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">KSA</span>
                <span className="font-mono text-accent-teal">{ksaRevised2030}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">UAE</span>
                <span className="font-mono text-accent-green">{uaeRevised2030}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pie expanding indicator */}
        <div className="bg-accent-teal/5 border border-accent-teal/20 rounded-lg p-3 text-center">
          <div className="text-[9px] uppercase tracking-wider text-accent-teal font-semibold mb-1">
            PIE EXPANDING
          </div>
          <div className="text-xl font-heading text-accent-teal">+{growthVsBaseline}%</div>
          <div className="text-[10px] text-text-muted">vs pre-conflict baseline</div>
        </div>
      </div>
    </motion.div>
  );
}
