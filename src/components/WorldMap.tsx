import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

/*
 * Simplified but recognizable world map focused on the key trade corridors.
 * Uses actual geographic proportions (Mercator-ish) for landmasses.
 */

// Simplified landmass outlines — recognizable, not cartographically precise
const LANDMASSES = {
  africa:
    'M 380 180 L 400 170 L 425 165 L 445 172 L 460 180 L 470 195 L 475 215 L 478 240 L 472 265 L 460 285 L 445 300 L 425 310 L 410 308 L 395 295 L 385 275 L 378 255 L 372 230 L 370 210 L 374 192 Z',
  europe:
    'M 380 100 L 395 95 L 415 92 L 435 95 L 450 100 L 460 110 L 465 125 L 458 140 L 448 152 L 435 158 L 420 162 L 405 165 L 390 160 L 380 148 L 375 135 L 372 120 L 375 108 Z',
  middleEast:
    'M 470 148 L 485 142 L 500 140 L 515 145 L 525 155 L 528 168 L 522 182 L 512 195 L 498 202 L 485 198 L 475 190 L 468 178 L 465 165 Z',
  southAsia:
    'M 540 155 L 558 148 L 575 150 L 585 160 L 582 175 L 572 192 L 558 205 L 545 210 L 535 200 L 530 185 L 532 170 Z',
  eastAsia:
    'M 600 100 L 625 92 L 648 90 L 668 95 L 678 108 L 680 125 L 675 145 L 665 160 L 648 168 L 632 165 L 618 155 L 608 140 L 600 125 L 598 110 Z',
  japan:
    'M 688 105 L 692 98 L 698 95 L 702 100 L 700 115 L 695 128 L 690 135 L 685 130 L 684 118 L 686 108 Z',
  taiwan: 'M 676 152 L 680 148 L 684 150 L 683 158 L 678 160 Z',
  seAsia:
    'M 618 172 L 635 170 L 650 175 L 660 185 L 655 200 L 642 210 L 625 215 L 612 208 L 608 195 L 610 182 Z',
  northAmerica:
    'M 120 80 L 160 72 L 200 75 L 230 85 L 250 100 L 260 120 L 255 145 L 242 165 L 225 180 L 205 190 L 185 185 L 165 175 L 148 160 L 135 140 L 125 120 L 118 100 Z',
};

const NODES = [
  { x: 680, y: 150, label: 'Taiwan', sub: 'TSMC Fab' },
  { x: 694, y: 115, label: 'Japan', sub: 'Substrates' },
  { x: 660, y: 100, label: 'Korea', sub: 'Samsung/SK' },
  { x: 505, y: 175, label: 'Gulf', sub: 'DC Sites' },
  { x: 228, y: 155, label: 'US', sub: 'Data Centers' },
  { x: 500, y: 160, label: '', sub: 'Strait of Hormuz' },
];

const ROUTES = {
  primary: {
    path: 'M 680 150 Q 640 155, 600 162 Q 560 170, 530 175 Q 515 178, 505 175',
    label: 'Primary (via Strait)',
  },
  cape: {
    path: 'M 505 175 Q 478 200, 460 230 Q 440 270, 420 300 Q 400 310, 380 295 Q 360 270, 350 240 Q 340 210, 335 180 Q 330 150, 310 130 Q 280 110, 250 120 Q 230 135, 228 155',
    label: 'Cape Reroute (+14–21d)',
  },
  pacific: {
    path: 'M 680 150 Q 720 155, 740 160 Q 760 165, 740 170 Q 700 180, 660 190 Q 600 200, 540 210 Q 480 215, 420 210 Q 360 195, 300 180 Q 260 170, 228 155',
    label: 'Pacific / US Direct',
  },
};

export function WorldMap() {
  const { conflictDay, checkpointChoices } = useStore();

  const straitClosed = checkpointChoices.day60 === 1;
  const isConflicting = conflictDay > 0;

  const primaryOpacity = straitClosed ? 0.1 : isConflicting ? 0.4 : 0.7;
  const capeOpacity = isConflicting ? (straitClosed ? 0.6 : 0.3) : 0;
  const pacificOpacity = straitClosed ? 0.5 : isConflicting ? 0.15 : 0.1;

  const straitStatus = straitClosed
    ? '#c43b3b'
    : conflictDay > 30
      ? '#d4930a'
      : '#2d9a6e';

  return (
    <div className="my-10">
      <svg
        viewBox="100 60 620 280"
        className="w-full h-auto"
        style={{ maxHeight: '380px' }}
      >
        {/* Landmasses */}
        {Object.values(LANDMASSES).map((d, i) => (
          <path
            key={i}
            d={d}
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="0.5"
          />
        ))}

        {/* Routes */}
        <motion.path
          d={ROUTES.primary.path}
          fill="none"
          stroke={straitClosed ? '#c43b3b' : '#8891a6'}
          strokeWidth="1.5"
          strokeDasharray={straitClosed ? '4 3' : 'none'}
          animate={{ opacity: primaryOpacity }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d={ROUTES.cape.path}
          fill="none"
          stroke="#d4930a"
          strokeWidth="1"
          strokeDasharray="3 3"
          animate={{ opacity: capeOpacity }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d={ROUTES.pacific.path}
          fill="none"
          stroke="#4a7fd4"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          animate={{ opacity: pacificOpacity }}
          transition={{ duration: 0.5 }}
        />

        {/* Strait indicator */}
        {isConflicting && (
          <motion.circle
            cx={505}
            cy={163}
            r={straitClosed ? 8 : 5}
            fill="none"
            stroke={straitStatus}
            strokeWidth="0.8"
            animate={{
              r: straitClosed ? [8, 11, 8] : [5, 7, 5],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* Nodes */}
        {NODES.map((node, i) => {
          const isStrait = node.sub === 'Strait of Hormuz';
          if (isStrait && !isConflicting) return null;
          return (
            <g key={i}>
              <circle
                cx={node.x}
                cy={node.y}
                r={isStrait ? 2.5 : 2}
                fill={isStrait ? straitStatus : 'rgba(255,255,255,0.5)'}
              />
              {node.label && (
                <text
                  x={node.x}
                  y={node.y - 8}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.55)"
                  fontSize="7"
                  fontFamily="Inter, sans-serif"
                  fontWeight="500"
                >
                  {node.label}
                </text>
              )}
              {isStrait && (
                <text
                  x={node.x + 12}
                  y={node.y + 3}
                  fill={straitStatus}
                  fontSize="5.5"
                  fontFamily="Inter, sans-serif"
                  opacity="0.7"
                >
                  {straitClosed ? 'CLOSED' : 'CONTESTED'}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(115, 320)">
          {[
            { color: '#8891a6', label: 'Primary route', dash: false, show: true },
            { color: '#d4930a', label: 'Cape reroute', dash: true, show: capeOpacity > 0 },
            { color: '#4a7fd4', label: 'Pacific', dash: true, show: true },
          ]
            .filter((l) => l.show)
            .map((item, i) => (
              <g key={i} transform={`translate(${i * 100}, 0)`}>
                <line
                  x1="0"
                  y1="0"
                  x2="14"
                  y2="0"
                  stroke={item.color}
                  strokeWidth="1"
                  strokeDasharray={item.dash ? '3 2' : 'none'}
                  opacity="0.6"
                />
                <text
                  x="18"
                  y="3"
                  fill="rgba(255,255,255,0.35)"
                  fontSize="6.5"
                  fontFamily="Inter, sans-serif"
                >
                  {item.label}
                </text>
              </g>
            ))}
        </g>
      </svg>
    </div>
  );
}
