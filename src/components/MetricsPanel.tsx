import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { PathHistory } from './PathHistory';

function MetricRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className="font-mono text-[12px] text-text-secondary">
        {value}
        {unit && <span className="text-text-muted/60 ml-0.5">{unit}</span>}
      </span>
    </div>
  );
}

export function MetricsPanel() {
  const { metrics, conflictDay, sidebarExpanded, toggleSidebar } = useStore();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 lg:hidden bg-bg-primary/90 backdrop-blur-sm border border-border-subtle px-3 py-2 text-[11px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
      >
        {sidebarExpanded ? 'Close' : 'Data'}
      </button>

      {/* Panel */}
      <AnimatePresence>
        <motion.aside
          initial={false}
          className={`fixed top-0 right-0 z-40 h-full w-64 bg-bg-primary/95 backdrop-blur-sm border-l border-border-subtle overflow-y-auto transition-transform duration-300 ${
            sidebarExpanded ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-5 pt-8">
            {/* Day counter */}
            <div className="mb-6">
              <div className="text-[10px] text-text-muted mb-1 font-mono">Day</div>
              <div className="font-heading text-3xl font-light text-text-primary tabular-nums">
                {conflictDay}
              </div>
              <div className="h-px w-full bg-white/[0.06] mt-3">
                <motion.div
                  className="h-px bg-white/20"
                  animate={{ width: `${(conflictDay / 360) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Path history */}
            <PathHistory />

            {/* Metrics */}
            <div className="mt-5 pt-4 border-t border-border-subtle">
              <MetricRow label="Insurance" value={metrics.maritimeInsurance} unit="%" />
              <MetricRow label="Air Freight" value={`${metrics.airFreight}x`} unit="" />
              <MetricRow label="Supply Chain" value={metrics.throughput} unit="%" />
              <MetricRow label="Capex Deploy" value={metrics.capexRate} unit="%" />
              <MetricRow label="Delay" value={metrics.delay} unit=" mo" />
              <MetricRow label="Inventory" value={metrics.inventory} unit=" days" />
              <MetricRow label="Stranded" value={`$${metrics.gap}B`} unit="" />
              <MetricRow label="Lobby" value={metrics.lobbyPressure} unit="/100" />
            </div>

            {/* Capital Rotation */}
            <div className="mt-4 pt-3 border-t border-border-subtle">
              <div className="text-[9px] text-text-muted mb-2 font-mono uppercase tracking-wider">
                Rotation
              </div>
              <MetricRow label="SW Rotation" value={metrics.softwareRotation.toFixed(1)} unit="%" />
              <MetricRow label="IGV Mult." value={`${metrics.igvMultiplier}x`} unit="" />
            </div>

            {/* Regional */}
            <div className="mt-4 pt-3 border-t border-border-subtle">
              <div className="text-[9px] text-text-muted mb-2 font-mono uppercase tracking-wider">
                Gulf
              </div>
              <MetricRow label="Capacity" value={metrics.gulfCapacity} unit=" MW" />
              <MetricRow label="Inland Shift" value={metrics.inlandShift} unit="%" />
              <MetricRow label="Def. Conf." value={metrics.defenseConfidence} unit="/100" />
            </div>

            {/* Escalation index */}
            <div className="mt-5 pt-4 border-t border-border-subtle">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-muted font-mono">Escalation</span>
                <span className="font-mono text-sm text-text-primary">
                  {useStore.getState().escalationIndex.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
}
