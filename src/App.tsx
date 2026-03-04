import { useEffect, useRef, useCallback } from 'react';
import { useStore } from './store/useStore';
import { MetricsPanel } from './components/MetricsPanel';
import { TimelineSlider } from './components/TimelineSlider';
import { Checkpoint } from './components/Checkpoint';
import { RotationSentimentCard } from './components/RotationSentiment';
import { Section0Baseline } from './sections/Section0Baseline';
import { Section1First30 } from './sections/Section1First30';
import { Section2Wall60 } from './sections/Section2Wall60';
import { Section3DualUse } from './sections/Section3DualUse';
import { Section4Earnings } from './sections/Section4Earnings';
import { Section5Lobby } from './sections/Section5Lobby';
import { Section6Endgame } from './sections/Section6Endgame';
import { Section7Final } from './sections/Section7Final';

// Map scroll position to conflict day based on section visibility
const SECTION_DAY_MAP = [
  { id: 'section-0', dayStart: 0, dayEnd: 0 },
  { id: 'section-1', dayStart: 1, dayEnd: 29 },
  { id: 'checkpoint-30', dayStart: 30, dayEnd: 30 },
  { id: 'section-2', dayStart: 31, dayEnd: 59 },
  { id: 'checkpoint-60', dayStart: 60, dayEnd: 60 },
  { id: 'section-3', dayStart: 61, dayEnd: 89 },
  { id: 'checkpoint-90', dayStart: 90, dayEnd: 90 },
  { id: 'section-4', dayStart: 91, dayEnd: 119 },
  { id: 'checkpoint-120', dayStart: 120, dayEnd: 120 },
  { id: 'section-5', dayStart: 121, dayEnd: 179 },
  { id: 'checkpoint-180', dayStart: 180, dayEnd: 180 },
  { id: 'section-6', dayStart: 181, dayEnd: 270 },
  { id: 'section-7', dayStart: 271, dayEnd: 360 },
];

function App() {
  const { setConflictDay, checkpointChoices, setActiveCheckpoint, scrollLocked } = useStore();
  const mainRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up Intersection Observer to track which section is visible
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const state = useStore.getState();
        if (state.scrollLocked) return;

        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const sectionId = entry.target.id;
            const mapping = SECTION_DAY_MAP.find((m) => m.id === sectionId);
            if (!mapping) continue;

            // Compute day based on how far we are into the section
            const rect = entry.target.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const sectionProgress = Math.max(
              0,
              Math.min(1, (viewportCenter - rect.top) / rect.height)
            );
            const day = Math.round(
              mapping.dayStart +
                (mapping.dayEnd - mapping.dayStart) * sectionProgress
            );

            setConflictDay(day);

            // Check if we've hit a checkpoint that needs a choice
            const checkpointKeys = ['day30', 'day60', 'day90', 'day120', 'day180'] as const;
            const checkpointDays = [30, 60, 90, 120, 180];
            const cpIndex = checkpointDays.indexOf(mapping.dayStart);
            if (cpIndex !== -1) {
              const key = checkpointKeys[cpIndex];
              if (state.checkpointChoices[key] === null) {
                setActiveCheckpoint(mapping.dayStart);
              }
            }
          }
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[id^="section-"], [id^="checkpoint-"]');
    sections.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [setConflictDay, setActiveCheckpoint]);

  useEffect(() => {
    // Slight delay to ensure DOM is ready
    const timer = setTimeout(setupObserver, 100);
    return () => clearTimeout(timer);
  }, [setupObserver, checkpointChoices]);

  // Prevent scroll when locked
  useEffect(() => {
    if (scrollLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [scrollLocked]);

  return (
    <div ref={mainRef} className="relative">
      {/* Main content area */}
      <main className="lg:mr-64 pb-20">
        <Section0Baseline />

        <Section1First30 />

        <Checkpoint
          day={30}
          storeKey="day30"
          title="The Nature of the Conflict"
          subtitle="How does the conflict evolve in its first month? Your assessment shapes the severity of every downstream disruption."
          optionA={{
            label: 'Contained Escalation',
            description:
              'The conflict stays regional. Strikes are targeted, no ground invasion. Shipping is disrupted but the Strait is not fully closed. Insurance premiums stabilize at elevated levels.',
            impact:
              'Supply chain throughput drops 15-25%. Market prices in a 60-90 day disruption.',
          }}
          optionB={{
            label: 'Spreading',
            description:
              'The conflict expands. New fronts open. Houthi activity intensifies, non-state actors enter the picture. The insurance market starts pricing in a longer and wider disruption.',
            impact:
              'Supply chain throughput drops 35-50%. Air freight multiplier jumps an additional 1.5x.',
          }}
        />

        {checkpointChoices.day30 !== null && (
          <>
            <Section2Wall60 />

            <Checkpoint
              day={60}
              storeKey="day60"
              title="The Strait Question"
              subtitle="The single most consequential fork. This decision determines whether the buildout is delayed or broken."
              optionA={{
                label: 'Diplomatic Signals',
                description:
                  'Backchannel talks surface. The Strait remains contested but not closed. Insurance premiums plateau. There is a credible path to partial normalization within 60 days.',
                impact:
                  'Throughput stabilizes. Recovery possible without full resolution. Buildout delay: 3-6 months.',
              }}
              optionB={{
                label: 'Strait Closed',
                description:
                  'The Strait of Hormuz is functionally closed to commercial traffic. Full reroute around the Cape of Good Hope adds 14-21 days to every shipment. Insurance goes parabolic.',
                impact:
                  'Throughput in freefall. Maritime insurance 80%+. Buildout delay: 9-18 months.',
              }}
            />
          </>
        )}

        {checkpointChoices.day60 !== null && (
          <>
            <Section3DualUse />

            <Checkpoint
              day={90}
              storeKey="day90"
              title="The Character of the War"
              subtitle="Is this a grinding proxy conflict or direct engagement between major powers? The character shapes whether the damage is chronic or acute."
              optionA={{
                label: 'Proxy Stalemate',
                description:
                  'The conflict settles into a grinding proxy war. No clear escalation or de-escalation. The worst state for supply chains: no catalyst for resolution but no acute crisis to force emergency measures.',
                impact:
                  'Metrics plateau at degraded levels. Slow bleed. Lobby pressure builds gradually.',
              }}
              optionB={{
                label: 'Direct Engagement',
                description:
                  'Major powers are directly involved. This is now a conventional conflict with state actors. Military logistics take absolute priority. The defense apparatus absorbs supply chain capacity.',
                impact:
                  'Metrics crater. Buildout frozen. Emergency measures redirect all dual-use materials.',
              }}
            />
            {checkpointChoices.day90 !== null && <RotationSentimentCard checkpointDay={90} />}
          </>
        )}

        {checkpointChoices.day90 !== null && (
          <>
            <Section4Earnings />

            <Checkpoint
              day={120}
              storeKey="day120"
              title="The Allocation Response"
              subtitle="How does the government manage the competition between defense and commercial demand for dual-use materials?"
              optionA={{
                label: 'DPA Activated',
                description:
                  'The government formally invokes the Defense Production Act. Mandatory allocation percentages are imposed. Commercial buyers queue behind military contracts. Orderly but devastating.',
                impact:
                  'Defense allocation: 30-50%. Predictable, plannable, terrible for the buildout.',
              }}
              optionB={{
                label: 'Market Rationing',
                description:
                  'No formal DPA but the market rations itself. Producers prioritize defense voluntarily. The result is similar but less predictable — some honor commercial contracts, others don\'t.',
                impact:
                  'Defense allocation: 20-60% volatile. Impossible to plan around. Variance kills.',
              }}
            />
            {checkpointChoices.day120 !== null && <RotationSentimentCard checkpointDay={120} />}
          </>
        )}

        {checkpointChoices.day120 !== null && (
          <>
            <Section5Lobby />

            <Checkpoint
              day={180}
              storeKey="day180"
              title="The Endgame"
              subtitle="Six months in. Does a resolution form, or does the world restructure permanently around the conflict?"
              optionA={{
                label: 'Resolution Forming',
                description:
                  'A diplomatic framework emerges. Ceasefire talks gain traction. The Strait begins limited reopening under naval escort. Markets price in recovery.',
                impact:
                  'Metrics begin recovering. Asymmetric recovery: fast initial bounce, long tail to full normalization.',
              }}
              optionB={{
                label: 'Permanent Restructuring',
                description:
                  'No resolution in sight. The conflict is structural. Supply chains are permanently rerouted. Companies write off Gulf investments. The AI buildout is replanned around a new world.',
                impact:
                  '$710B becomes $400-500B over 2x the timeline. The US cedes AGI timeline advantage.',
              }}
            />
          </>
        )}

        {checkpointChoices.day180 !== null && (
          <>
            <Section6Endgame />
            <Section7Final />
          </>
        )}
      </main>

      {/* Sticky UI */}
      <MetricsPanel />
      <TimelineSlider />
    </div>
  );
}

export default App;
