import { useStore } from '../store/useStore';
import { Section, Paragraph } from '../components/Section';
import { motion } from 'framer-motion';
import type { CheckpointChoices } from '../lib/metrics';
import {
  computeAllMetrics,
  rotationWindowPeak,
  rotationWindowStart,
  rotationWindowEnd,
  softwareRotationIndex,
} from '../lib/metrics';

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
    <div className="flex items-start gap-3 mb-3">
      <div className="flex flex-col items-center pt-1">
        <div
          className={`w-2 h-2 rounded-full ${
            isEscalation ? 'bg-accent-red/50' : 'bg-accent-green/50'
          }`}
        />
      </div>
      <div>
        <div className="text-[10px] text-text-muted font-mono">Day {info.day}</div>
        <div className={`text-[13px] ${isEscalation ? 'text-accent-red/80' : 'text-accent-green/80'}`}>
          {info.options[choice]}
        </div>
      </div>
    </div>
  );
}

function ComparisonBar({ label, yourValue, avgValue, unit }: {
  label: string; yourValue: number; avgValue: number; unit: string;
}) {
  const maxVal = Math.max(yourValue, avgValue) * 1.2 || 1;
  const yourPct = (yourValue / maxVal) * 100;
  const avgPct = (avgValue / maxVal) * 100;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-[10px] text-text-muted mb-1">
        <span>{label}</span>
        <span className="font-mono">
          {yourValue}{unit} <span className="opacity-50">vs</span> {avgValue}{unit}
        </span>
      </div>
      <div className="relative h-1 bg-white/[0.03]">
        <div
          className="absolute top-0 h-full bg-white/[0.06]"
          style={{ width: `${avgPct}%` }}
        />
        <motion.div
          className="absolute top-0 h-full bg-white/20"
          animate={{ width: `${yourPct}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}

function RotationSummary({ escalationIndex }: { escalationIndex: number }) {
  const peakDay = rotationWindowPeak(escalationIndex);
  const peakRotation = softwareRotationIndex(peakDay, escalationIndex);
  const windowStart = rotationWindowStart(escalationIndex);
  const windowEndDay = rotationWindowEnd(escalationIndex);
  const windowDuration = windowEndDay - windowStart;
  const currentRotation = softwareRotationIndex(360, escalationIndex);
  const rotationStatus = currentRotation > 5 ? 'active' : currentRotation > 0 ? 'expired' : 'never opened';

  let totalSWCapex = 0;
  for (let d = windowStart; d <= windowEndDay; d += 5) {
    totalSWCapex += softwareRotationIndex(d, escalationIndex) * 0.01 * 710 * (5 / 360);
  }

  return (
    <div className="mt-6 pt-5 border-t border-border-subtle">
      <div className="text-[10px] font-mono text-text-muted mb-3">
        Capital Rotation Summary
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <div className="text-sm font-mono text-text-primary">{peakRotation.toFixed(1)}%</div>
          <div className="text-[9px] text-text-muted">Peak (Day {peakDay})</div>
        </div>
        <div>
          <div className="text-sm font-mono text-text-secondary">{windowDuration}d</div>
          <div className="text-[9px] text-text-muted">Window</div>
        </div>
        <div>
          <div className="text-sm font-mono text-text-secondary">${totalSWCapex.toFixed(0)}B</div>
          <div className="text-[9px] text-text-muted">SW capex flow</div>
        </div>
        <div>
          <div className="text-sm font-mono text-text-secondary">{rotationStatus}</div>
          <div className="text-[9px] text-text-muted">Day 360 status</div>
        </div>
      </div>
    </div>
  );
}

function RegionalSummary({ metrics, escalationIndex }: { metrics: import('../lib/metrics').Metrics; escalationIndex: number }) {
  const dist = metrics.regionalDist;
  const centerOfGravity = dist.ksa > dist.uae
    ? 'inland-dominant'
    : dist.ksa > 30
      ? 'shifting inland'
      : 'coastal';

  const uaeCapacity360 = Math.round(400 + 400 * (1 - escalationIndex * 0.2));
  const ksaCapacity360 = Math.round(67 + 800 * (1 + escalationIndex * 0.5));
  const bahrainCapacity360 = Math.round(20 + 40 * (1 + escalationIndex * 0.3));

  return (
    <div className="mt-5 pt-5 border-t border-border-subtle">
      <div className="text-[10px] font-mono text-text-muted mb-3">
        Gulf Corridor Summary
      </div>
      <div className="space-y-1.5 mb-3">
        {[
          { label: 'UAE', start: '400MW', end: `${uaeCapacity360}MW` },
          { label: 'KSA', start: '67MW', end: `${ksaCapacity360}MW` },
          { label: 'Bahrain', start: '20MW', end: `${bahrainCapacity360}MW` },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between text-[12px]">
            <span className="text-text-muted w-16">{item.label}</span>
            <span className="font-mono text-text-secondary">{item.start} → {item.end}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
        <div>
          <div className="text-sm font-mono text-text-primary">{metrics.gulfCapacity}MW</div>
          <div className="text-[9px] text-text-muted">Total capacity</div>
        </div>
        <div>
          <div className="text-sm font-mono text-text-secondary">{centerOfGravity}</div>
          <div className="text-[9px] text-text-muted">Center of gravity</div>
        </div>
      </div>
    </div>
  );
}

export function Section7Final() {
  const { checkpointChoices, metrics, escalationIndex, resetAll } = useStore();

  const avgMetrics = computeAllMetrics(360, 0.5);
  const allChosen = Object.values(checkpointChoices).every((v) => v !== null);

  return (
    <Section
      id="section-7"
      dayRange="Day 271–360"
      title="The Final Accounting"
    >
      <Paragraph>
        <strong>The capex spenders are anti-war out of arithmetic.</strong> This is what the arithmetic
        looks like under the scenario you constructed.
      </Paragraph>

      {allChosen ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-8"
        >
          {/* Decision tree */}
          <div className="mb-6">
            <div className="text-[10px] font-mono text-text-muted mb-4">
              Your Scenario
            </div>
            {(Object.keys(CHOICE_LABELS) as (keyof CheckpointChoices)[]).map((key) => (
              <DecisionNode key={key} checkpoint={key} choice={checkpointChoices[key]} />
            ))}
          </div>

          {/* Escalation score */}
          <div className="flex items-center justify-between py-4 border-y border-border-subtle mb-6">
            <span className="text-sm text-text-secondary">Escalation Index</span>
            <span className="font-mono text-lg text-text-primary">{escalationIndex.toFixed(2)}</span>
          </div>

          {/* Comparison */}
          <div className="mb-6">
            <div className="text-[10px] font-mono text-text-muted mb-4">
              vs Average Path
            </div>
            <ComparisonBar label="Delay" yourValue={metrics.delay} avgValue={avgMetrics.delay} unit=" mo" />
            <ComparisonBar label="Supply Chain" yourValue={metrics.throughput} avgValue={avgMetrics.throughput} unit="%" />
            <ComparisonBar label="Stranded" yourValue={metrics.gap} avgValue={avgMetrics.gap} unit="B" />
            <ComparisonBar label="Lobby" yourValue={metrics.lobbyPressure} avgValue={avgMetrics.lobbyPressure} unit="" />
            <ComparisonBar label="Insurance" yourValue={metrics.maritimeInsurance} avgValue={avgMetrics.maritimeInsurance} unit="%" />
          </div>

          {/* Final metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 border-y border-border-subtle">
            {[
              { label: 'Total Delay', value: `${metrics.delay} mo` },
              { label: 'Stranded', value: `$${metrics.gap}B` },
              { label: 'Throughput', value: `${metrics.throughput}%` },
              { label: 'Lobby', value: `${metrics.lobbyPressure}` },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xl font-heading text-text-primary">{item.value}</div>
                <div className="text-[9px] text-text-muted mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          <RotationSummary escalationIndex={escalationIndex} />
          <RegionalSummary metrics={metrics} escalationIndex={escalationIndex} />
        </motion.div>
      ) : (
        <div className="py-8 my-8 text-center border-y border-border-subtle">
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
          className="text-sm text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
        >
          Explore a Different Path
        </button>
        <p className="text-[11px] text-text-muted/60 mt-2">
          Scroll back to the top and make different choices.
        </p>
      </motion.div>
    </Section>
  );
}
