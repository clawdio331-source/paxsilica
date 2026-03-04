import { useStore } from '../store/useStore';
import { Section, Paragraph } from '../components/Section';
import { motion } from 'framer-motion';
import type { CheckpointChoices } from '../lib/metrics';
import { computeEscalationIndex, computeAllMetrics } from '../lib/metrics';

const CHOICE_LABELS: Record<keyof CheckpointChoices, { day: number; options: [string, string]; question: string }> = {
  day30: { day: 30, options: ['Contained Escalation', 'Spreading'], question: 'Nature of the Conflict' },
  day60: { day: 60, options: ['Diplomatic Signals', 'Strait Closed'], question: 'The Strait Question' },
  day90: { day: 90, options: ['Proxy Stalemate', 'Direct Engagement'], question: 'Character of the War' },
  day120: { day: 120, options: ['DPA Activated', 'Market Rationing'], question: 'Allocation Response' },
  day180: { day: 180, options: ['Resolution Forming', 'Permanent Restructuring'], question: 'The Endgame' },
};

function DecisionNode({ checkpoint, choice }: { checkpoint: keyof CheckpointChoices; choice: 0 | 1 | null }) {
  if (choice === null) return null;
  const info = CHOICE_LABELS[checkpoint];
  const isEscalation = choice === 1;

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`w-3 h-3 rounded-full border-2 ${
            isEscalation ? 'border-accent-red bg-accent-red/30' : 'border-accent-green bg-accent-green/30'
          }`}
        />
        <div className="w-px h-8 bg-border-subtle last:hidden" />
      </div>
      <div className="pb-4">
        <div className="text-[9px] text-text-muted uppercase tracking-wider">Day {info.day} — {info.question}</div>
        <div className={`text-sm font-medium ${isEscalation ? 'text-accent-red' : 'text-accent-green'}`}>
          {info.options[choice]}
        </div>
      </div>
    </div>
  );
}

function ComparisonBar({ label, yourValue, avgValue, unit, inverted = false }: {
  label: string; yourValue: number; avgValue: number; unit: string; inverted?: boolean;
}) {
  const maxVal = Math.max(yourValue, avgValue) * 1.2 || 1;
  const yourPct = (yourValue / maxVal) * 100;
  const avgPct = (avgValue / maxVal) * 100;
  const yourBetter = inverted ? yourValue > avgValue : yourValue < avgValue;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-[10px] text-text-muted mb-1">
        <span>{label}</span>
        <span className="font-mono">
          {yourValue}{unit} <span className="text-text-muted/50">vs</span> {avgValue}{unit} avg
        </span>
      </div>
      <div className="relative h-3 bg-bg-primary rounded-full overflow-hidden">
        <div
          className="absolute top-0 h-full bg-text-muted/20 rounded-full"
          style={{ width: `${avgPct}%` }}
        />
        <motion.div
          className={`absolute top-0 h-full rounded-full ${yourBetter ? 'bg-accent-green/60' : 'bg-accent-red/60'}`}
          animate={{ width: `${yourPct}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}

export function Section7Final() {
  const { checkpointChoices, metrics, escalationIndex, resetAll } = useStore();

  // Compute average scenario (ei = 0.5)
  const avgMetrics = computeAllMetrics(360, 0.5);

  const allChosen = Object.values(checkpointChoices).every((v) => v !== null);

  return (
    <Section
      id="section-7"
      dayRange="Day 271–360"
      label="Section 7"
      title="The Final Accounting"
    >
      <Paragraph>
        The capex spenders are anti-war out of arithmetic. This is what the arithmetic
        looks like under the scenario you constructed.
      </Paragraph>

      {allChosen ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-elevated/60 border border-border-subtle rounded-xl p-6 md:p-8 my-8"
        >
          {/* Decision tree */}
          <div className="mb-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-4">
              Your Scenario Path
            </div>
            {(Object.keys(CHOICE_LABELS) as (keyof CheckpointChoices)[]).map((key) => (
              <DecisionNode key={key} checkpoint={key} choice={checkpointChoices[key]} />
            ))}
          </div>

          {/* Escalation score */}
          <div className="flex items-center justify-between py-4 border-y border-border-subtle mb-6">
            <span className="text-sm text-text-secondary">Composite Escalation Index</span>
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-bg-primary rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent-green via-accent-amber to-accent-red"
                  animate={{ width: `${escalationIndex * 100}%` }}
                />
              </div>
              <span className="font-mono text-lg text-accent-teal">{escalationIndex.toFixed(2)}</span>
            </div>
          </div>

          {/* Comparison */}
          <div className="mb-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-4">
              Your Scenario vs Average Path
            </div>
            <ComparisonBar label="Buildout Delay" yourValue={metrics.delay} avgValue={avgMetrics.delay} unit=" mo" />
            <ComparisonBar label="Supply Chain" yourValue={metrics.throughput} avgValue={avgMetrics.throughput} unit="%" inverted />
            <ComparisonBar label="Stranded Capex" yourValue={metrics.gap} avgValue={avgMetrics.gap} unit="B" />
            <ComparisonBar label="Lobby Pressure" yourValue={metrics.lobbyPressure} avgValue={avgMetrics.lobbyPressure} unit="" />
            <ComparisonBar label="Maritime Insurance" yourValue={metrics.maritimeInsurance} avgValue={avgMetrics.maritimeInsurance} unit="%" />
          </div>

          {/* Final metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Delay', value: `${metrics.delay} mo`, color: metrics.delay > 9 ? 'text-accent-red' : 'text-accent-amber' },
              { label: 'Stranded', value: `$${metrics.gap}B`, color: metrics.gap > 100 ? 'text-accent-red' : 'text-accent-amber' },
              { label: 'Throughput', value: `${metrics.throughput}%`, color: metrics.throughput < 50 ? 'text-accent-red' : 'text-accent-green' },
              { label: 'Lobby Score', value: `${metrics.lobbyPressure}`, color: metrics.lobbyPressure > 65 ? 'text-accent-red' : 'text-accent-amber' },
            ].map((item) => (
              <div key={item.label} className="bg-bg-primary/50 rounded-lg p-3 text-center">
                <div className={`text-xl font-heading ${item.color}`}>{item.value}</div>
                <div className="text-[9px] uppercase tracking-wider text-text-muted mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="bg-bg-elevated/40 border border-border-subtle rounded-xl p-8 my-8 text-center">
          <p className="text-text-muted text-sm">
            Complete all 5 checkpoints to see your full scenario summary.
          </p>
        </div>
      )}

      <Paragraph>
        Drag the path history to try different choices and see how the arithmetic
        changes. Every combination of five binary decisions produces a different
        buildout reality — 32 possible scenarios, each with its own economic logic,
        its own lobby pressure curve, its own timeline for when peace becomes cheaper
        than war.
      </Paragraph>

      {/* Replay CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mt-12 pt-8 border-t border-border-subtle"
      >
        <button
          onClick={resetAll}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-accent-teal/30 text-accent-teal hover:bg-accent-teal/10 transition-colors text-sm font-medium cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C5.79086 14 3.87539 12.7252 2.92893 10.8787" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2 4V8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Explore a Different Path
        </button>
        <p className="text-[11px] text-text-muted mt-3">
          Scroll back to the top and make different choices at each checkpoint.
        </p>
      </motion.div>
    </Section>
  );
}
