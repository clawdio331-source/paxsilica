import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { PathHistory } from './PathHistory';

function MetricRow({
  label,
  value,
  unit,
  status,
}: {
  label: string;
  value: string | number;
  unit: string;
  status: 'green' | 'amber' | 'red';
}) {
  const colors = {
    green: 'text-accent-green',
    amber: 'text-accent-amber',
    red: 'text-accent-red',
  };

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-b-0">
      <span className="text-[11px] text-text-secondary uppercase tracking-wider">{label}</span>
      <span className={`font-mono text-sm font-medium ${colors[status]}`}>
        {value}
        <span className="text-text-muted ml-0.5 text-[10px]">{unit}</span>
      </span>
    </div>
  );
}

function getStatus(value: number, thresholds: [number, number]): 'green' | 'amber' | 'red' {
  if (value <= thresholds[0]) return 'green';
  if (value <= thresholds[1]) return 'amber';
  return 'red';
}

function getInverseStatus(value: number, thresholds: [number, number]): 'green' | 'amber' | 'red' {
  if (value >= thresholds[1]) return 'green';
  if (value >= thresholds[0]) return 'amber';
  return 'red';
}

export function MetricsPanel() {
  const { metrics, conflictDay, sidebarExpanded, toggleSidebar } = useStore();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 lg:hidden glass-panel rounded-lg px-3 py-2 text-xs text-text-secondary hover:text-text-primary transition-colors"
      >
        {sidebarExpanded ? 'Close' : 'Metrics'}
      </button>

      {/* Panel */}
      <AnimatePresence>
        <motion.aside
          initial={false}
          className={`fixed top-0 right-0 z-40 h-full w-72 glass-panel border-l border-border-subtle overflow-y-auto transition-transform duration-300 ${
            sidebarExpanded ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-5 pt-6">
            {/* Day counter */}
            <div className="mb-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-1">
                Conflict Day
              </div>
              <div className="font-heading text-3xl font-light text-accent-teal tabular-nums">
                {conflictDay}
              </div>
              <div className="h-1 w-full bg-bg-secondary rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(to right, #10b981, #f59e0b, #ef4444)',
                  }}
                  animate={{ width: `${(conflictDay / 360) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Path history */}
            <PathHistory />

            {/* Metrics */}
            <div className="mt-4 space-y-0">
              <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-2">
                Live Metrics
              </div>

              <MetricRow
                label="Maritime Insurance"
                value={metrics.maritimeInsurance}
                unit="%"
                status={getStatus(metrics.maritimeInsurance, [15, 40])}
              />
              <MetricRow
                label="Air Freight Cost"
                value={`${metrics.airFreight}x`}
                unit=""
                status={getStatus(metrics.airFreight, [2, 4])}
              />
              <MetricRow
                label="Supply Chain"
                value={metrics.throughput}
                unit="%"
                status={getInverseStatus(metrics.throughput, [50, 80])}
              />
              <MetricRow
                label="Defense Alloc."
                value={metrics.defenseAllocation}
                unit="%"
                status={getStatus(metrics.defenseAllocation, [10, 25])}
              />
              <MetricRow
                label="Capex Deploy"
                value={metrics.capexRate}
                unit="%"
                status={getInverseStatus(metrics.capexRate, [50, 80])}
              />
              <MetricRow
                label="Buildout Delay"
                value={metrics.delay}
                unit="mo"
                status={getStatus(metrics.delay, [3, 9])}
              />
              <MetricRow
                label="Inventory"
                value={metrics.inventory}
                unit="days"
                status={getInverseStatus(metrics.inventory, [20, 50])}
              />
              <MetricRow
                label="Stranded Capex"
                value={`$${metrics.gap}B`}
                unit=""
                status={getStatus(metrics.gap, [30, 100])}
              />
              <MetricRow
                label="Lobby Pressure"
                value={metrics.lobbyPressure}
                unit="/100"
                status={getStatus(metrics.lobbyPressure, [30, 65])}
              />
            </div>

            {/* Escalation index */}
            <div className="mt-5 pt-4 border-t border-border-subtle">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  Escalation Index
                </span>
                <span className="font-mono text-lg font-medium text-accent-teal">
                  {useStore.getState().escalationIndex.toFixed(2)}
                </span>
              </div>
              <div className="h-1.5 w-full bg-bg-secondary rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent-green via-accent-amber to-accent-red"
                  animate={{ width: `${useStore.getState().escalationIndex * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
}
