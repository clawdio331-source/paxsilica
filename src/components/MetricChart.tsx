import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ComposedChart,
  Line,
} from 'recharts';
import {
  supplyChainThroughput,
  capexDeploymentRate,
  lobbyPressureIndex,
  maritimeInsurancePremium,
  softwareRotationIndex,
} from '../lib/metrics';

type MetricType = 'throughput' | 'capex' | 'lobby' | 'insurance';

const METRIC_CONFIG: Record<MetricType, {
  fn: (day: number, ei: number) => number;
  color: string;
  label: string;
  domain: [number, number];
}> = {
  throughput: {
    fn: supplyChainThroughput,
    color: '#8891a6',
    label: 'Supply Chain Throughput (%)',
    domain: [0, 100],
  },
  capex: {
    fn: capexDeploymentRate,
    color: '#8891a6',
    label: 'Capex Deployment Rate (%)',
    domain: [0, 100],
  },
  lobby: {
    fn: lobbyPressureIndex,
    color: '#d4930a',
    label: 'Lobby Pressure Index',
    domain: [0, 100],
  },
  insurance: {
    fn: maritimeInsurancePremium,
    color: '#c43b3b',
    label: 'Maritime Insurance (%)',
    domain: [0, 100],
  },
};

export function MetricChart({ type, height = 160 }: { type: MetricType; height?: number }) {
  const { escalationIndex, conflictDay } = useStore();
  const config = METRIC_CONFIG[type];

  const data = useMemo(() => {
    const points = [];
    for (let d = 0; d <= 360; d += 5) {
      points.push({
        day: d,
        value: config.fn(d, escalationIndex),
      });
    }
    return points;
  }, [escalationIndex, config]);

  return (
    <div className="my-6">
      <div className="text-[10px] font-mono text-text-muted mb-2">
        {config.label}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={config.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 9, fill: '#525c70' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.04)' }}
            tickFormatter={(v) => `${v}`}
          />
          <YAxis
            domain={config.domain}
            tick={{ fontSize: 9, fill: '#525c70' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0b0f19',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '0',
              fontSize: '11px',
              color: '#d4d8e4',
            }}
            formatter={(value: number | undefined) => [value?.toFixed(1) ?? '0', config.label]}
            labelFormatter={(label) => `Day ${label}`}
          />
          <ReferenceLine
            x={conflictDay}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={config.color}
            strokeWidth={1.5}
            fill={`url(#grad-${type})`}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Lobby + IGV dual-axis chart showing "The Arithmetic Deadline"
 */
export function LobbyRotationChart({ height = 200 }: { height?: number }) {
  const { escalationIndex, conflictDay } = useStore();

  const data = useMemo(() => {
    const points = [];
    for (let d = 0; d <= 360; d += 5) {
      const lobby = lobbyPressureIndex(d, escalationIndex);
      const rotation = softwareRotationIndex(d, escalationIndex);
      points.push({ day: d, lobby, rotation });
    }
    return points;
  }, [escalationIndex]);

  const crossoverDay = useMemo(() => {
    for (let d = 60; d <= 300; d += 5) {
      const rotCurr = softwareRotationIndex(d, escalationIndex);
      const rotPrev = softwareRotationIndex(d - 5, escalationIndex);
      const lobbyCurr = lobbyPressureIndex(d, escalationIndex);
      const lobbyPrev = lobbyPressureIndex(d - 5, escalationIndex);
      if (rotCurr < rotPrev && lobbyCurr > lobbyPrev && rotCurr > 2) {
        return d;
      }
    }
    return null;
  }, [escalationIndex]);

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] font-mono text-text-muted">
          Lobby Pressure vs Software Rotation
        </div>
        {crossoverDay && (
          <div className="text-[9px] font-mono text-text-muted">
            Deadline: Day {crossoverDay}
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 5, right: 40, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="grad-lobby-overlay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4930a" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#d4930a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 9, fill: '#525c70' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.04)' }}
            tickFormatter={(v) => `${v}`}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: '#525c70' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 30]}
            tick={{ fontSize: 9, fill: '#525c70' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0b0f19',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '0',
              fontSize: '11px',
              color: '#d4d8e4',
            }}
            labelFormatter={(label) => `Day ${label}`}
          />
          <ReferenceLine
            x={conflictDay}
            yAxisId="left"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          {crossoverDay && (
            <ReferenceLine
              x={crossoverDay}
              yAxisId="left"
              stroke="rgba(196, 59, 59, 0.3)"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
          )}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="lobby"
            stroke="#d4930a"
            strokeWidth={1.5}
            fill="url(#grad-lobby-overlay)"
            name="Lobby Pressure"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="rotation"
            stroke="#4a7fd4"
            strokeWidth={1.5}
            dot={false}
            name="Software Rotation %"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-px bg-[#d4930a]" />
          <span className="text-[9px] text-text-muted">Lobby</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-px bg-[#4a7fd4]" />
          <span className="text-[9px] text-text-muted">Rotation</span>
        </div>
      </div>
    </div>
  );
}
