import { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import type { GeoPermissibleObjects } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, Geometry } from 'geojson';

const TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';

const WIDTH = 800;
const HEIGHT = 420;

const projection = geoNaturalEarth1()
  .scale(145)
  .translate([WIDTH / 2, HEIGHT / 2 + 20]);

const pathGen = geoPath(projection);

// Key nodes in lon/lat
const NODES_GEO = [
  { lon: 121.5, lat: 25.0, label: 'Taiwan', sub: 'TSMC Fab' },
  { lon: 139.7, lat: 35.7, label: 'Japan', sub: 'Substrates' },
  { lon: 127.0, lat: 37.5, label: 'Korea', sub: 'Samsung/SK' },
  { lon: 54.4, lat: 24.5, label: 'Gulf', sub: 'DC Sites' },
  { lon: -98.0, lat: 38.0, label: 'US', sub: 'Data Centers' },
  { lon: 56.3, lat: 26.6, label: '', sub: 'Strait of Hormuz' },
];

function projectPoint(lon: number, lat: number): [number, number] {
  return (projection([lon, lat]) as [number, number]) ?? [0, 0];
}

// Build a smooth curve between two projected points via optional waypoints
function routePath(coords: [number, number][]): string {
  if (coords.length < 2) return '';
  const pts = coords.map(([lon, lat]) => projectPoint(lon, lat));
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cx = (prev[0] + curr[0]) / 2;
    const cy = (prev[1] + curr[1]) / 2;
    d += ` Q ${prev[0] + (cx - prev[0]) * 0.5} ${prev[1] + (cy - prev[1]) * 1.2}, ${curr[0]} ${curr[1]}`;
  }
  return d;
}

const PRIMARY_ROUTE = routePath([
  [121.5, 25], [110, 15], [95, 10], [80, 12], [65, 20], [56.3, 26.6], [54, 24],
]);

const CAPE_ROUTE = routePath([
  [54, 24], [50, 20], [45, 12], [42, 5], [38, -5], [30, -20],
  [20, -34], [15, -34.5], [5, -30], [-5, -15], [0, 5],
  [-10, 15], [-20, 25], [-40, 30], [-60, 32], [-80, 30], [-98, 38],
]);

const PACIFIC_ROUTE = routePath([
  [121.5, 25], [140, 35], [160, 40], [180, 42], [-160, 40],
  [-140, 38], [-120, 35], [-98, 38],
]);

export function WorldMap() {
  const { conflictDay, checkpointChoices } = useStore();
  const [landGeo, setLandGeo] = useState<FeatureCollection<Geometry> | null>(null);

  useEffect(() => {
    fetch(TOPO_URL)
      .then((r) => r.json())
      .then((topo: Topology<{ land: GeometryCollection }>) => {
        const geo = feature(topo, topo.objects.land) as FeatureCollection<Geometry>;
        setLandGeo(geo);
      })
      .catch(() => {
        // Silently fail — map will just not show landmasses
      });
  }, []);

  const landPaths = useMemo(() => {
    if (!landGeo) return [];
    return landGeo.features.map((f) => pathGen(f as GeoPermissibleObjects) ?? '');
  }, [landGeo]);

  const straitClosed = checkpointChoices.day60 === 1;
  const isConflicting = conflictDay > 0;

  const primaryOpacity = straitClosed ? 0.08 : isConflicting ? 0.4 : 0.6;
  const capeOpacity = isConflicting ? (straitClosed ? 0.5 : 0.2) : 0;
  const pacificOpacity = straitClosed ? 0.4 : isConflicting ? 0.12 : 0.08;

  const straitColor = straitClosed
    ? '#c43b3b'
    : conflictDay > 30
      ? '#d4930a'
      : '#2d9a6e';

  const projectedNodes = NODES_GEO.map((n) => {
    const [x, y] = projectPoint(n.lon, n.lat);
    return { ...n, x, y };
  });

  const straitNode = projectedNodes.find((n) => n.sub === 'Strait of Hormuz')!;

  return (
    <div className="my-10">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" style={{ maxHeight: '380px' }}>
        {/* Landmasses from Natural Earth */}
        {landPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />
        ))}

        {/* Trade routes */}
        <motion.path
          d={PRIMARY_ROUTE}
          fill="none"
          stroke={straitClosed ? '#c43b3b' : '#8891a6'}
          strokeWidth="1.5"
          strokeDasharray={straitClosed ? '6 4' : 'none'}
          animate={{ opacity: primaryOpacity }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d={CAPE_ROUTE}
          fill="none"
          stroke="#d4930a"
          strokeWidth="1"
          strokeDasharray="4 4"
          animate={{ opacity: capeOpacity }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d={PACIFIC_ROUTE}
          fill="none"
          stroke="#4a7fd4"
          strokeWidth="0.8"
          strokeDasharray="3 4"
          animate={{ opacity: pacificOpacity }}
          transition={{ duration: 0.5 }}
        />

        {/* Strait pulsing indicator */}
        {isConflicting && (
          <motion.circle
            cx={straitNode.x}
            cy={straitNode.y}
            r={6}
            fill="none"
            stroke={straitColor}
            strokeWidth="1"
            animate={{
              r: straitClosed ? [8, 12, 8] : [5, 8, 5],
              opacity: [0.4, 0.15, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* Nodes */}
        {projectedNodes.map((node, i) => {
          const isStrait = node.sub === 'Strait of Hormuz';
          if (isStrait && !isConflicting) return null;
          return (
            <g key={i}>
              <circle
                cx={node.x}
                cy={node.y}
                r={isStrait ? 2.5 : 3}
                fill={isStrait ? straitColor : 'rgba(255,255,255,0.5)'}
              />
              {node.label && (
                <text
                  x={node.x}
                  y={node.y - 10}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.6)"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  fontWeight="500"
                >
                  {node.label}
                </text>
              )}
              {isStrait && (
                <text
                  x={node.x + 14}
                  y={node.y + 4}
                  fill={straitColor}
                  fontSize="8"
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
        <g transform={`translate(20, ${HEIGHT - 30})`}>
          {[
            { color: '#8891a6', label: 'Primary route', dash: false, show: true },
            { color: '#d4930a', label: 'Cape reroute', dash: true, show: capeOpacity > 0 },
            { color: '#4a7fd4', label: 'Pacific', dash: true, show: true },
          ]
            .filter((l) => l.show)
            .map((item, i) => (
              <g key={i} transform={`translate(${i * 120}, 0)`}>
                <line
                  x1="0" y1="0" x2="18" y2="0"
                  stroke={item.color}
                  strokeWidth="1.2"
                  strokeDasharray={item.dash ? '4 3' : 'none'}
                  opacity="0.6"
                />
                <text
                  x="24" y="3.5"
                  fill="rgba(255,255,255,0.35)"
                  fontSize="9"
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
