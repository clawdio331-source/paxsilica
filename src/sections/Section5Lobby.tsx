import { useStore } from '../store/useStore';
import { Section, Paragraph, Callout } from '../components/Section';
import { MetricChart } from '../components/MetricChart';
import { motion } from 'framer-motion';

function LobbyGauge() {
  const { metrics } = useStore();
  const pressure = metrics.lobbyPressure;
  const angle = (pressure / 100) * 180;

  return (
    <div className="flex flex-col items-center my-6">
      <svg viewBox="0 0 200 120" className="w-64 h-auto">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#lobbyGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="251"
          animate={{ strokeDashoffset: 251 - (pressure / 100) * 251 }}
          transition={{ duration: 0.8 }}
        />
        <defs>
          <linearGradient id="lobbyGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        {/* Needle */}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{
            rotate: -90 + angle,
          }}
          style={{ transformOrigin: '100px 100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <circle cx="100" cy="100" r="4" fill="rgba(45, 212, 191, 0.8)" />
        {/* Value */}
        <text x="100" y="90" textAnchor="middle" fill="#e8eaf0" fontSize="22" fontFamily="IBM Plex Serif" fontWeight="300">
          {pressure}
        </text>
      </svg>
      <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted mt-1">
        Lobby Pressure Index
      </div>
    </div>
  );
}

export function Section5Lobby() {
  const { escalationIndex } = useStore();
  const isMild = escalationIndex < 0.3;
  const isSevere = escalationIndex > 0.6;

  return (
    <Section
      id="section-5"
      dayRange="Day 121–180"
      label="Section 5"
      title="The Lobby Inflection"
    >
      <Paragraph>
        The AI directive from late February frames AGI as century-defining technology.
        The companies funding the AGI race are the primary contractors of the national
        security state. When they engage the White House about shipping lanes, that is a
        national security briefing with a capex deadline attached.
      </Paragraph>

      <LobbyGauge />

      <Paragraph>
        The administration cannot claim AI supremacy as doctrine and simultaneously
        allow a regional war to starve the chip supply chain. This is the contradiction
        that the capex spenders exploit — not through threats, but through arithmetic.
        The numbers make the argument.
      </Paragraph>

      <MetricChart type="lobby" />

      {isMild ? (
        <Callout type="info">
          On this path, lobbying is quiet: private meetings, "concern" expressed in
          earnings calls, gentle reminders about deployment timelines. The pressure is
          real but subtle. The administration has room to maneuver.
        </Callout>
      ) : isSevere ? (
        <Callout type="danger">
          On this path, the lobby inflection hits hard: emergency meetings with the
          National Security Council. AI companies threaten to move capex offshore. A
          public break forms between Silicon Valley and the administration's conflict
          posture. The pressure is existential.
        </Callout>
      ) : (
        <Callout type="warning">
          Coordinated industry letters. Public statements from CEOs. Lobbying spend
          spikes to historic levels. The capex spenders are no longer asking — they
          are demanding a resolution timeline.
        </Callout>
      )}

      <Paragraph>
        This is where national security interest and corporate interest become
        indistinguishable. The same people who need AI supremacy need the shipping
        lanes open. The same budget that funds defense needs the buildout on schedule.
        The convergence is not incidental — it is structural.
      </Paragraph>
    </Section>
  );
}
