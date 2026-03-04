import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

interface DCNode {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  facilities: number;
  mw: number;
  isCoastal: boolean;
}

const NODES: DCNode[] = [
  { id: 'uae', label: 'UAE', sublabel: '57 facilities', x: 280, y: 170, facilities: 57, mw: 400, isCoastal: true },
  { id: 'ksa', label: 'KSA', sublabel: '51 facilities', x: 170, y: 150, facilities: 51, mw: 67, isCoastal: false },
  { id: 'bahrain', label: 'Bahrain', sublabel: '8 facilities', x: 250, y: 130, facilities: 8, mw: 20, isCoastal: true },
  { id: 'qatar', label: 'Qatar', sublabel: '12 facilities', x: 260, y: 145, facilities: 12, mw: 30, isCoastal: true },
  { id: 'oman', label: 'Oman', sublabel: '6 facilities', x: 310, y: 195, facilities: 6, mw: 15, isCoastal: true },
];

function ShieldIcon({ x, y, active }: { x: number; y: number; active: boolean }) {
  if (!active) return null;
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <path
        d={`M ${x} ${y - 8} L ${x + 6} ${y - 4} L ${x + 6} ${y + 2} Q ${x + 4} ${y + 7}, ${x} ${y + 9} Q ${x - 4} ${y + 7}, ${x - 6} ${y + 2} L ${x - 6} ${y - 4} Z`}
        fill="rgba(16, 185, 129, 0.2)"
        stroke="#10b981"
        strokeWidth="0.8"
      />
      <text x={x} y={y + 1} textAnchor="middle" fill="#10b981" fontSize="6" fontWeight="bold">
        &#10003;
      </text>
    </motion.g>
  );
}

function StrikeMarker({ x, y, intercepted }: { x: number; y: number; intercepted: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, intercepted ? 0.3 : 0.8], scale: [0, 1.5, 1] }}
      transition={{ duration: 0.6 }}
    >
      {intercepted ? (
        // Deflected — amber flash
        <circle cx={x} cy={y} r="3" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5" />
      ) : (
        // Impact — red
        <circle cx={x} cy={y} r="2.5" fill="#ef4444" opacity="0.6" />
      )}
    </motion.g>
  );
}

export function GulfMap() {
  const { conflictDay, escalationIndex, metrics } = useStore();
  const isConflicting = conflictDay > 0;
  const showStrikes = conflictDay >= 5;
  const dist = metrics.regionalDist;
  const inlandShift = metrics.inlandShift;

  // KSA growth ring radius scales with inland shift
  const ksaGrowthRadius = 10 + (inlandShift - 35) * 0.6;

  return (
    <div className="bg-bg-elevated/40 border border-border-subtle rounded-xl p-5 my-6">
      <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-1">
        Gulf Compute Corridor
      </div>
      <h4 className="font-heading text-lg mb-3 text-text-primary">
        Regional Infrastructure Map
      </h4>

      <svg viewBox="80 60 300 200" className="w-full h-auto" style={{ maxHeight: '340px' }}>
        <defs>
          {/* Distance-from-threat gradient: warm near strait, cool inland */}
          <radialGradient id="threatGrad" cx="300" cy="160" r="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.06)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0.03)" />
          </radialGradient>
          <filter id="gulfGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect x="80" y="60" width="300" height="200" fill="url(#threatGrad)" />

        {/* Simplified Gulf coastline */}
        <path
          d="M 220 80 Q 260 90, 290 110 Q 310 130, 320 155 Q 330 180, 310 210 Q 290 230, 260 240"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        {/* Arabian Peninsula outline */}
        <path
          d="M 100 100 Q 130 80, 180 75 Q 220 78, 220 80 L 260 240 Q 200 250, 140 230 Q 100 200, 90 160 Z"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />

        {/* Strait of Hormuz label */}
        <text x="310" y="145" fill="rgba(239, 68, 68, 0.6)" fontSize="6" fontFamily="Inter">
          Strait of Hormuz
        </text>
        <line x1="300" y1="140" x2="320" y2="155" stroke="rgba(239,68,68,0.3)" strokeWidth="0.5" strokeDasharray="2 2" />

        {/* KSA growth ring */}
        {isConflicting && (
          <motion.circle
            cx={NODES[1].x}
            cy={NODES[1].y}
            fill="none"
            stroke="rgba(45, 212, 191, 0.2)"
            strokeWidth="1.5"
            animate={{
              r: [ksaGrowthRadius, ksaGrowthRadius + 4, ksaGrowthRadius],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* Bahrain-KSA link */}
        <line
          x1={NODES[1].x}
          y1={NODES[1].y}
          x2={NODES[2].x}
          y2={NODES[2].y}
          stroke="rgba(45, 212, 191, 0.15)"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <text
          x={(NODES[1].x + NODES[2].x) / 2 - 5}
          y={(NODES[1].y + NODES[2].y) / 2 - 5}
          fill="rgba(255,255,255,0.2)"
          fontSize="5"
          fontFamily="Inter"
        >
          annex
        </text>

        {/* Data center nodes */}
        {NODES.map((node) => {
          const share = node.id === 'uae' ? dist.uae : node.id === 'ksa' ? dist.ksa : node.id === 'bahrain' ? dist.bahrain : dist.other / 2;
          const radius = 3 + share * 0.15;
          const isKSA = node.id === 'ksa';

          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                fill={isKSA ? 'rgba(45, 212, 191, 0.6)' : 'rgba(16, 185, 129, 0.5)'}
                stroke={isKSA ? '#2dd4bf' : '#10b981'}
                strokeWidth="1"
                animate={{ r: radius }}
                transition={{ duration: 0.5 }}
                filter="url(#gulfGlow)"
              />
              <text
                x={node.x}
                y={node.y - radius - 4}
                textAnchor="middle"
                fill="rgba(255,255,255,0.8)"
                fontSize="7"
                fontFamily="Inter"
                fontWeight="500"
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + radius + 9}
                textAnchor="middle"
                fill="rgba(255,255,255,0.35)"
                fontSize="5"
                fontFamily="Inter"
              >
                {share.toFixed(0)}% · {node.sublabel}
              </text>

              {/* Shield icon for defended coastal nodes */}
              {showStrikes && node.isCoastal && (node.id === 'uae' || node.id === 'bahrain') && (
                <ShieldIcon x={node.x + radius + 8} y={node.y} active={true} />
              )}
            </g>
          );
        })}

        {/* Strike markers on coastal nodes */}
        {showStrikes && (
          <>
            <StrikeMarker x={NODES[0].x - 8} y={NODES[0].y - 5} intercepted={true} />
            <StrikeMarker x={NODES[0].x + 5} y={NODES[0].y + 7} intercepted={true} />
            <StrikeMarker x={NODES[0].x - 3} y={NODES[0].y + 4} intercepted={true} />
            {escalationIndex > 0.3 && (
              <>
                <StrikeMarker x={NODES[0].x + 10} y={NODES[0].y - 3} intercepted={false} />
                <StrikeMarker x={NODES[2].x + 4} y={NODES[2].y - 3} intercepted={true} />
              </>
            )}
          </>
        )}
      </svg>

      {/* Capacity bar chart */}
      <div className="mt-4 space-y-2">
        <div className="text-[9px] uppercase tracking-wider text-text-muted mb-1">Capacity Distribution (MW)</div>
        {[
          { label: 'UAE', current: 400, pipeline: 600, color: '#10b981', share: dist.uae },
          { label: 'KSA', current: 67, pipeline: 2200, color: '#2dd4bf', share: dist.ksa },
          { label: 'Bahrain', current: 20, pipeline: 80, color: '#3b82f6', share: dist.bahrain },
        ].map((item) => {
          const pipelineScale = item.id === 'ksa' ? 1 + (inlandShift - 35) * 0.02 : 1;
          const maxVal = 2400;
          const currentPct = (item.current / maxVal) * 100;
          const pipelinePct = (item.pipeline * (item.label === 'KSA' ? pipelineScale : 1) / maxVal) * 100;
          return (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-[10px] text-text-secondary w-14 shrink-0">{item.label}</span>
              <div className="flex-1 h-3 bg-bg-primary rounded-full overflow-hidden relative">
                {/* Pipeline (outline) */}
                <div
                  className="absolute top-0 h-full rounded-full border border-white/10"
                  style={{ width: `${Math.min(pipelinePct, 100)}%` }}
                />
                {/* Current (solid) */}
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: item.color }}
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
        <div className="flex gap-4 mt-1">
          <div className="flex items-center gap-1">
            <div className="w-3 h-2 rounded-sm bg-accent-green" />
            <span className="text-[8px] text-text-muted">Current</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-2 rounded-sm border border-white/10" />
            <span className="text-[8px] text-text-muted">Pipeline</span>
          </div>
        </div>
      </div>

      {/* Total capacity */}
      <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between">
        <span className="text-[10px] text-text-muted">Total Gulf Capacity</span>
        <span className="font-mono text-sm text-accent-teal">{metrics.gulfCapacity} MW</span>
      </div>
    </div>
  );
}
