import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { coastalPauseDuration } from '../lib/metrics';

export function InlandShiftCalculator() {
  const { escalationIndex } = useStore();
  const [totalPipeline, setTotalPipeline] = useState(3300);
  const [acceleration, setAcceleration] = useState(20);
  const [coastalPause, setCoastalPause] = useState(Math.round(coastalPauseDuration(escalationIndex)));

  // Revised KSA capacity projections
  const ksaBase2028 = 400;
  const ksaBase2030 = 1100;
  const ksaRevised2028 = Math.round(ksaBase2028 * (1 + acceleration / 100));
  const ksaRevised2030 = Math.round(ksaBase2030 * (1 + acceleration / 100));

  // UAE capacity during/after pause
  const uaeBase2028 = 800;
  const uaeBase2030 = 1200;
  const pauseImpact = Math.min(coastalPause / 360, 0.3);
  const uaeRevised2028 = Math.round(uaeBase2028 * (1 - pauseImpact * 0.3));
  const uaeRevised2030 = Math.round(uaeBase2030 * (1 - pauseImpact * 0.1));

  const totalBaseline = ksaBase2030 + uaeBase2030 + 200;
  const totalRevised = ksaRevised2030 + uaeRevised2030 + Math.round(200 * (1 + acceleration / 200));
  const growthVsBaseline = ((totalRevised / totalBaseline - 1) * 100).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      className="my-8 py-6 border-t border-border-subtle"
    >
      <h4 className="font-heading text-lg mb-5 text-text-primary">The Inland Shift</h4>

      <div className="space-y-4 mb-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] text-text-secondary">Total Gulf Pipeline (MW by 2030)</label>
            <span className="text-[12px] font-mono text-text-primary">{totalPipeline} MW</span>
          </div>
          <input
            type="range" min={1000} max={5000} step={100} value={totalPipeline}
            onChange={(e) => setTotalPipeline(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] text-text-secondary">Conflict-Driven Inland Acceleration</label>
            <span className="text-[12px] font-mono text-text-primary">{acceleration}%</span>
          </div>
          <input
            type="range" min={0} max={50} step={5} value={acceleration}
            onChange={(e) => setAcceleration(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] text-text-secondary">Coastal Buildout Pause Duration</label>
            <span className="text-[12px] font-mono text-text-primary">{coastalPause} days</span>
          </div>
          <input
            type="range" min={0} max={180} step={10} value={coastalPause}
            onChange={(e) => setCoastalPause(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border-subtle">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-[10px] text-text-muted mb-2 font-mono">2028 (MW)</div>
            <div className="space-y-1">
              <div className="flex justify-between text-[12px]">
                <span className="text-text-secondary">KSA</span>
                <span className="font-mono text-text-primary">{ksaRevised2028}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-text-secondary">UAE</span>
                <span className="font-mono text-text-primary">{uaeRevised2028}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-text-muted mb-2 font-mono">2030 (MW)</div>
            <div className="space-y-1">
              <div className="flex justify-between text-[12px]">
                <span className="text-text-secondary">KSA</span>
                <span className="font-mono text-text-primary">{ksaRevised2030}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-text-secondary">UAE</span>
                <span className="font-mono text-text-primary">{uaeRevised2030}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-3 border-t border-border-subtle">
          <div className="text-xl font-heading text-text-primary">+{growthVsBaseline}%</div>
          <div className="text-[10px] text-text-muted">vs pre-conflict baseline</div>
        </div>
      </div>
    </motion.div>
  );
}
