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
    color: '#10b981',
    label: 'Supply Chain Throughput (%)',
    domain: [0, 100],
  },
  capex: {
    fn: capexDeploymentRate,
    color: '#3b82f6',
    label: 'Capex Deployment Rate (%)',
    domain: [0, 100],
  },
  lobby: {
    fn: lobbyPressureIndex,
    color: '#f59e0b',
    label: 'Lobby Pressure Index',
    domain: [0, 100],
  },
  insurance: {
    fn: maritimeInsurancePremium,
    color: '#ef4444',
    label: 'Maritime Insurance (%)',
    domain: [0, 100],
  },
};

export function MetricChart({ type, height = 180 }: { type: MetricType; height?: number }) {
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
    <div className="bg-bg-elevated/40 border border-border-subtle rounded-xl p-4 my-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-3">
        {config.label}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={config.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 9, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickFormatter={(v) => `D${v}`}
          />
          <YAxis
            domain={config.domain}
            tick={{ fontSize: 9, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#1a2035',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#e8eaf0',
            }}
            formatter={(value: number | undefined) => [value?.toFixed(1) ?? '0', config.label]}
            labelFormatter={(label) => `Day ${label}`}
          />
          <ReferenceLine
            x={conflictDay}
            stroke="rgba(45, 212, 191, 0.5)"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={config.color}
            strokeWidth={2}
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
export function LobbyRotationChart({ height = 220 }: { height?: number }) {
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

  // Find crossover: lobby still rising, rotation declining
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
    <div className="bg-bg-elevated/40 border border-border-subtle rounded-xl p-4 my-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
          Lobby Pressure vs Software Rotation
        </div>
        {crossoverDay && (
          <div className="text-[9px] font-mono text-accent-red bg-accent-red/10 px-2 py-0.5 rounded">
            Arithmetic Deadline: Day {crossoverDay}
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 5, right: 40, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="grad-lobby-overlay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 9, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickFormatter={(v) => `D${v}`}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Lobby', angle: -90, position: 'insideLeft', style: { fontSize: 8, fill: '#6b7280' } }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 30]}
            tick={{ fontSize: 9, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Rotation %', angle: 90, position: 'insideRight', style: { fontSize: 8, fill: '#6b7280' } }}
          />
          <Tooltip
            contentStyle={{
              background: '#1a2035',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#e8eaf0',
            }}
            labelFormatter={(label) => `Day ${label}`}
          />
          <ReferenceLine
            x={conflictDay}
            yAxisId="left"
            stroke="rgba(45, 212, 191, 0.5)"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          {crossoverDay && (
            <ReferenceLine
              x={crossoverDay}
              yAxisId="left"
              stroke="rgba(239, 68, 68, 0.4)"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{ value: 'Deadline', position: 'top', style: { fontSize: 8, fill: '#ef4444' } }}
            />
          )}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="lobby"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#grad-lobby-overlay)"
            name="Lobby Pressure"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="rotation"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Software Rotation %"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-accent-amber" />
          <span className="text-[9px] text-text-muted">Lobby Pressure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-accent-blue" />
          <span className="text-[9px] text-text-muted">Software Rotation</span>
        </div>
        {crossoverDay && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-accent-red border-t border-dashed" />
            <span className="text-[9px] text-text-muted">Arithmetic Deadline</span>
          </div>
        )}
      </div>
    </div>
  );
}
