import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

// Simplified SVG world map focused on key trade routes
// Points: Taiwan/Korea/Japan -> Strait of Hormuz -> Gulf -> Cape of Good Hope alternative -> US

const ROUTES = {
  normal: {
    label: 'Primary Route (via Strait)',
    path: 'M 680 200 Q 620 220, 560 230 Q 500 240, 450 260 Q 420 270, 380 280',
    color: '#10b981',
  },
  reroute: {
    label: 'Cape Reroute',
    path: 'M 680 200 Q 620 240, 560 280 Q 500 340, 440 380 Q 380 400, 340 370 Q 300 340, 280 300 Q 260 260, 280 230 Q 300 200, 340 190 Q 360 185, 380 280',
    color: '#f59e0b',
  },
  pacific: {
    label: 'Pacific Direct',
    path: 'M 680 200 Q 740 220, 800 230 Q 850 240, 820 250',
    color: '#3b82f6',
  },
};

const NODES = [
  { x: 680, y: 200, label: 'East Asia Fab', sublabel: 'Taiwan, Japan, Korea' },
  { x: 450, y: 260, label: 'Strait of Hormuz', sublabel: 'Chokepoint' },
  { x: 380, y: 280, label: 'Gulf DC Sites', sublabel: 'UAE, Saudi Arabia' },
  { x: 820, y: 250, label: 'US Facilities', sublabel: 'Data Centers' },
  { x: 340, y: 370, label: 'Cape of Good Hope', sublabel: '+14-21 days' },
];

export function WorldMap() {
  const { conflictDay, checkpointChoices } = useStore();

  // Route status based on conflict progression
  const straitClosed = checkpointChoices.day60 === 1;
  const isConflicting = conflictDay > 0;
  const normalRouteOpacity = straitClosed ? 0.15 : isConflicting ? 0.5 : 1;
  const rerouteOpacity = isConflicting ? (straitClosed ? 1 : 0.6) : 0;
  const pacificOpacity = straitClosed ? 0.8 : 0.3;

  const straitColor = straitClosed
    ? '#ef4444'
    : conflictDay > 30
      ? '#f59e0b'
      : conflictDay > 0
        ? '#f59e0b'
        : '#10b981';

  return (
    <div className="w-full max-w-3xl mx-auto">
      <svg viewBox="200 140 700 300" className="w-full h-auto" style={{ filter: 'drop-shadow(0 0 20px rgba(45, 212, 191, 0.08))' }}>
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="200" y="140" width="700" height="300" fill="url(#grid)" />

        {/* Simplified landmasses */}
        <path
          d="M 280 180 Q 300 170, 340 175 Q 380 180, 420 200 Q 440 220, 430 250 Q 420 280, 400 310 Q 380 340, 350 360 Q 330 370, 320 360 Q 310 340, 300 300 Q 290 260, 280 230 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />
        {/* Middle East */}
        <path
          d="M 430 220 Q 450 210, 470 215 Q 490 220, 480 240 Q 470 260, 450 270 Q 435 275, 430 260 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />
        {/* South/East Asia */}
        <path
          d="M 580 180 Q 620 170, 660 175 Q 700 180, 720 200 Q 730 220, 710 240 Q 690 255, 660 250 Q 630 245, 610 230 Q 590 215, 580 195 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />
        {/* North America */}
        <path
          d="M 780 170 Q 830 160, 860 180 Q 880 200, 870 240 Q 850 270, 820 280 Q 800 275, 790 250 Q 780 220, 780 190 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />

        {/* Normal route */}
        <motion.path
          d={ROUTES.normal.path}
          fill="none"
          stroke={straitClosed ? '#ef4444' : ROUTES.normal.color}
          strokeWidth="2"
          strokeDasharray={straitClosed ? '6 4' : 'none'}
          animate={{ opacity: normalRouteOpacity }}
          transition={{ duration: 0.6 }}
          filter="url(#glow)"
        />

        {/* Cape reroute */}
        <motion.path
          d={ROUTES.reroute.path}
          fill="none"
          stroke={ROUTES.reroute.color}
          strokeWidth="1.5"
          strokeDasharray="4 3"
          animate={{ opacity: rerouteOpacity }}
          transition={{ duration: 0.6 }}
        />

        {/* Pacific route */}
        <motion.path
          d={ROUTES.pacific.path}
          fill="none"
          stroke={ROUTES.pacific.color}
          strokeWidth="1.5"
          animate={{ opacity: pacificOpacity }}
          transition={{ duration: 0.6 }}
        />

        {/* Strait of Hormuz danger zone */}
        {isConflicting && (
          <motion.circle
            cx={450}
            cy={260}
            r={straitClosed ? 18 : 12}
            fill="none"
            stroke={straitColor}
            strokeWidth="1"
            animate={{
              r: straitClosed ? [18, 22, 18] : [12, 15, 12],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Nodes */}
        {NODES.map((node, i) => {
          const isStrait = node.label === 'Strait of Hormuz';
          const nodeColor = isStrait ? straitColor : 'rgba(255,255,255,0.7)';
          return (
            <g key={i}>
              <circle
                cx={node.x}
                cy={node.y}
                r={isStrait ? 5 : 4}
                fill={isStrait ? straitColor : 'rgba(45, 212, 191, 0.8)'}
                filter="url(#glow)"
              />
              <text
                x={node.x}
                y={node.y - 12}
                textAnchor="middle"
                fill={nodeColor}
                fontSize="8"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + 16}
                textAnchor="middle"
                fill="rgba(255,255,255,0.35)"
                fontSize="6"
                fontFamily="Inter, sans-serif"
              >
                {node.sublabel}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(220, 400)">
          {[
            { color: '#10b981', label: 'Normal Route', opacity: normalRouteOpacity },
            { color: '#f59e0b', label: 'Cape Reroute', opacity: rerouteOpacity },
            { color: '#3b82f6', label: 'Pacific Direct', opacity: pacificOpacity },
          ].map((item, i) => (
            <g key={i} transform={`translate(${i * 130}, 0)`} opacity={Math.max(item.opacity, 0.4)}>
              <line x1="0" y1="0" x2="16" y2="0" stroke={item.color} strokeWidth="2" />
              <text x="22" y="3" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="Inter, sans-serif">
                {item.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
