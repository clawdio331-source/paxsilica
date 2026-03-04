import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

interface DCNode {
  id: string;
  label: string;
  x: number;
  y: number;
  mw: number;
  isCoastal: boolean;
}

const NODES: DCNode[] = [
  { id: 'uae', label: 'UAE', x: 280, y: 170, mw: 400, isCoastal: true },
  { id: 'ksa', label: 'KSA', x: 170, y: 150, mw: 67, isCoastal: false },
  { id: 'bahrain', label: 'Bahrain', x: 248, y: 132, mw: 20, isCoastal: true },
  { id: 'qatar', label: 'Qatar', x: 262, y: 148, mw: 30, isCoastal: true },
  { id: 'oman', label: 'Oman', x: 310, y: 192, mw: 15, isCoastal: true },
];

export function GulfMap() {
  const { conflictDay, escalationIndex, metrics } = useStore();
  const isConflicting = conflictDay > 0;
  const dist = metrics.regionalDist;
  const inlandShift = metrics.inlandShift;

  const ksaGrowthRadius = 8 + (inlandShift - 35) * 0.4;

  return (
    <div className="my-8">
      <svg viewBox="80 60 300 200" className="w-full h-auto" style={{ maxHeight: '320px' }}>
        {/* Arabian Peninsula outline */}
        <path
          d="M 100 100 Q 130 80, 180 75 Q 220 78, 240 85 Q 260 90, 290 110 Q 310 130, 320 155 Q 330 180, 310 210 Q 290 230, 260 240 Q 200 250, 140 230 Q 100 200, 90 160 Z"
          fill="rgba(255,255,255,0.015)"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />
        {/* Gulf water */}
        <path
          d="M 240 85 Q 260 90, 290 110 Q 310 130, 320 155 Q 330 180, 310 210"
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="8"
        />

        {/* Strait of Hormuz */}
        <line
          x1="305"
          y1="145"
          x2="325"
          y2="160"
          stroke={isConflicting ? 'rgba(196, 59, 59, 0.3)' : 'rgba(255,255,255,0.06)'}
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <text
          x="328"
          y="155"
          fill={isConflicting ? 'rgba(196, 59, 59, 0.5)' : 'rgba(255,255,255,0.2)'}
          fontSize="5"
          fontFamily="Inter, sans-serif"
        >
          Strait
        </text>

        {/* KSA growth ring */}
        {isConflicting && (
          <motion.circle
            cx={NODES[1].x}
            cy={NODES[1].y}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            animate={{
              r: [ksaGrowthRadius, ksaGrowthRadius + 3, ksaGrowthRadius],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}

        {/* Bahrain–KSA link */}
        <line
          x1={NODES[1].x}
          y1={NODES[1].y}
          x2={NODES[2].x}
          y2={NODES[2].y}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />

        {/* Nodes */}
        {NODES.map((node) => {
          const share =
            node.id === 'uae'
              ? dist.uae
              : node.id === 'ksa'
                ? dist.ksa
                : node.id === 'bahrain'
                  ? dist.bahrain
                  : dist.other / 2;
          const radius = 2 + share * 0.1;
          const isKSA = node.id === 'ksa';

          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                fill={isKSA ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)'}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
                animate={{ r: radius }}
                transition={{ duration: 0.5 }}
              />
              <text
                x={node.x}
                y={node.y - radius - 5}
                textAnchor="middle"
                fill="rgba(255,255,255,0.55)"
                fontSize="6.5"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + radius + 8}
                textAnchor="middle"
                fill="rgba(255,255,255,0.25)"
                fontSize="5"
                fontFamily="'JetBrains Mono', monospace"
              >
                {share.toFixed(0)}%
              </text>
            </g>
          );
        })}

        {/* Strike indicator — subtle */}
        {conflictDay >= 5 && escalationIndex > 0.3 && (
          <motion.circle
            cx={NODES[0].x + 6}
            cy={NODES[0].y - 4}
            r="1.5"
            fill="none"
            stroke="rgba(196, 59, 59, 0.4)"
            strokeWidth="0.5"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </svg>

      {/* Capacity bars — minimal */}
      <div className="space-y-2 mt-2">
        {[
          { label: 'UAE', share: dist.uae, current: 400 },
          { label: 'KSA', share: dist.ksa, current: 67 },
          { label: 'Bahrain', share: dist.bahrain, current: 20 },
        ].map((item) => {
          const maxVal = 2400;
          const currentPct = (item.current / maxVal) * 100;
          return (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted w-14 shrink-0">{item.label}</span>
              <div className="flex-1 h-px bg-white/[0.04] overflow-hidden">
                <motion.div
                  className="h-full bg-white/20"
                  animate={{ width: `${Math.min(currentPct, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-[9px] font-mono text-text-muted w-10 text-right">
                {item.share.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
        <span className="text-[10px] text-text-muted">Total Gulf Capacity</span>
        <span className="font-mono text-sm text-text-secondary">{metrics.gulfCapacity} MW</span>
      </div>
    </div>
  );
}
