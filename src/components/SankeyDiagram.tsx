import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

// Simplified Sankey showing material flow split: Commercial vs Defense
export function SankeyDiagram() {
  const { metrics, checkpointChoices } = useStore();
  const defenseAlloc = metrics.defenseAllocation;
  const commercialAlloc = 100 - defenseAlloc;

  const isDPA = checkpointChoices.day120 === 0;
  const isMarketRation = checkpointChoices.day120 === 1;

  return (
    <div className="bg-bg-elevated/40 border border-border-subtle rounded-xl p-5 my-6">
      <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-3">
        Material Allocation Flow
      </div>

      <svg viewBox="0 0 500 200" className="w-full h-auto">
        {/* Source: Total Supply */}
        <rect x="10" y="40" width="80" height="120" rx="4" fill="rgba(45, 212, 191, 0.15)" stroke="rgba(45, 212, 191, 0.3)" strokeWidth="1" />
        <text x="50" y="95" textAnchor="middle" fill="#9ca3b8" fontSize="8" fontFamily="Inter">Total Supply</text>
        <text x="50" y="110" textAnchor="middle" fill="#2dd4bf" fontSize="10" fontFamily="Inter" fontWeight="600">100%</text>

        {/* Commercial allocation */}
        <motion.path
          d={`M 90 ${100 - commercialAlloc * 0.6} Q 200 ${80 - commercialAlloc * 0.4}, 310 50`}
          fill="none"
          stroke="#10b981"
          strokeWidth={Math.max(2, commercialAlloc / 8)}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Defense allocation */}
        <motion.path
          d={`M 90 ${100 + defenseAlloc * 0.6} Q 200 ${120 + defenseAlloc * 0.4}, 310 150`}
          fill="none"
          stroke="#ef4444"
          strokeWidth={Math.max(1, defenseAlloc / 8)}
          animate={{ opacity: defenseAlloc > 0 ? 1 : 0.2 }}
          transition={{ duration: 0.5 }}
        />

        {/* Dest: Commercial / AI Buildout */}
        <rect x="310" y="25" width="100" height="55" rx="4" fill="rgba(16, 185, 129, 0.1)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
        <text x="360" y="50" textAnchor="middle" fill="#9ca3b8" fontSize="7" fontFamily="Inter">AI Buildout</text>
        <text x="360" y="65" textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="Inter" fontWeight="600">
          {commercialAlloc.toFixed(0)}%
        </text>

        {/* Dest: Defense */}
        <rect x="310" y="125" width="100" height="55" rx="4" fill="rgba(239, 68, 68, 0.1)" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" />
        <text x="360" y="150" textAnchor="middle" fill="#9ca3b8" fontSize="7" fontFamily="Inter">Defense</text>
        <text x="360" y="165" textAnchor="middle" fill="#ef4444" fontSize="11" fontFamily="Inter" fontWeight="600">
          {defenseAlloc.toFixed(0)}%
        </text>

        {/* Labels */}
        {isDPA && (
          <text x="440" y="155" fill="#f59e0b" fontSize="7" fontFamily="Inter">DPA Mandated</text>
        )}
        {isMarketRation && (
          <text x="440" y="155" fill="#f59e0b" fontSize="7" fontFamily="Inter">Market Rationed</text>
        )}
      </svg>

      <div className="text-[11px] text-text-muted mt-2">
        {defenseAlloc > 25
          ? 'Defense allocation is severely impacting commercial GPU production schedules.'
          : defenseAlloc > 10
            ? 'Material flow is being redirected. Commercial supply under pressure.'
            : 'Defense allocation remains minimal. Commercial supply largely intact.'}
      </div>
    </div>
  );
}
