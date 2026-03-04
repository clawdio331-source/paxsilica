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
} from 'recharts';
import {
  supplyChainThroughput,
  capexDeploymentRate,
  lobbyPressureIndex,
  maritimeInsurancePremium,
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
