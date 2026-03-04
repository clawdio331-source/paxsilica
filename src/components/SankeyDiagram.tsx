import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export function SankeyDiagram() {
  const { metrics, checkpointChoices } = useStore();
  const defenseAlloc = metrics.defenseAllocation;
  const commercialAlloc = 100 - defenseAlloc;

  const isDPA = checkpointChoices.day120 === 0;
  const isMarketRation = checkpointChoices.day120 === 1;

  return (
    <div className="my-8">
      <svg viewBox="0 0 500 200" className="w-full h-auto">
        {/* Source: Total Supply */}
        <text x="50" y="95" textAnchor="middle" fill="#525c70" fontSize="8" fontFamily="Inter">
          Total Supply
        </text>
        <text x="50" y="110" textAnchor="middle" fill="#d4d8e4" fontSize="10" fontFamily="'JetBrains Mono', monospace">
          100%
        </text>

        {/* Commercial flow */}
        <motion.path
          d={`M 90 ${100 - commercialAlloc * 0.6} Q 200 ${80 - commercialAlloc * 0.4}, 310 50`}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={Math.max(2, commercialAlloc / 8)}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Defense flow */}
        <motion.path
          d={`M 90 ${100 + defenseAlloc * 0.6} Q 200 ${120 + defenseAlloc * 0.4}, 310 150`}
          fill="none"
          stroke="rgba(196, 59, 59, 0.3)"
          strokeWidth={Math.max(1, defenseAlloc / 8)}
          animate={{ opacity: defenseAlloc > 0 ? 1 : 0.2 }}
          transition={{ duration: 0.5 }}
        />

        {/* Dest: AI Buildout */}
        <text x="360" y="50" textAnchor="middle" fill="#525c70" fontSize="7" fontFamily="Inter">
          AI Buildout
        </text>
        <text x="360" y="65" textAnchor="middle" fill="#d4d8e4" fontSize="11" fontFamily="'JetBrains Mono', monospace">
          {commercialAlloc.toFixed(0)}%
        </text>

        {/* Dest: Defense */}
        <text x="360" y="150" textAnchor="middle" fill="#525c70" fontSize="7" fontFamily="Inter">
          Defense
        </text>
        <text x="360" y="165" textAnchor="middle" fill="#c43b3b" fontSize="11" fontFamily="'JetBrains Mono', monospace">
          {defenseAlloc.toFixed(0)}%
        </text>

        {/* Label */}
        {isDPA && (
          <text x="440" y="155" fill="#525c70" fontSize="7" fontFamily="Inter">DPA Mandated</text>
        )}
        {isMarketRation && (
          <text x="440" y="155" fill="#525c70" fontSize="7" fontFamily="Inter">Market Rationed</text>
        )}
      </svg>

      <p className="text-[13px] text-text-muted mt-1 leading-[1.7]">
        {defenseAlloc > 25
          ? 'Defense allocation is severely impacting commercial GPU production schedules.'
          : defenseAlloc > 10
            ? 'Material flow is being redirected. Commercial supply under pressure.'
            : 'Defense allocation remains minimal. Commercial supply largely intact.'}
      </p>
    </div>
  );
}
