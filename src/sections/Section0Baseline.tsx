import { Section, Paragraph, StatGrid } from '../components/Section';
import { WorldMap } from '../components/WorldMap';

export function Section0Baseline() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl md:text-[3.5rem] lg:text-[4.5rem] mb-5 text-text-primary leading-[1.08] tracking-[-0.03em]">
            Pax Silica
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-3 font-heading italic">
            The Capex Peace Lobby
          </p>
          <p className="text-[14px] text-text-muted max-w-md mx-auto leading-[1.8] mb-14">
            A $700 billion AI infrastructure buildout meets a Middle East conflict.
            Scroll to explore how the economics of artificial intelligence become
            the strongest force for peace.
          </p>
          <div className="text-text-muted text-[11px] tracking-wider">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="inline-block mr-1.5 mb-0.5"
            >
              <path
                d="M8 2V14M8 14L3 9M8 14L13 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Scroll to begin
          </div>
        </div>
      </section>

      {/* Baseline data */}
      <Section
        id="section-0"
        dayRange="Day 0"
        title="Before Escalation"
      >
        <Paragraph>
          The <strong>$710 billion</strong> capex commitment across hyperscalers represents the largest
          coordinated infrastructure bet in corporate history. Supply chains run clean.
          Maritime insurance sits at <strong>peacetime premiums</strong>. The Gulf region positions itself
          as the "New Switzerland" for compute — sovereign wealth funding data center
          campuses from Abu Dhabi to Neom.
        </Paragraph>

        <StatGrid
          stats={[
            { label: 'Total Capex Committed', value: '$710B' },
            { label: 'Supply Chain', value: '100%' },
            { label: 'Insurance Premium', value: '2%' },
            { label: 'Buildout Delay', value: '0 mo' },
            { label: 'Air Freight', value: '1.0x' },
            { label: 'Defense Allocation', value: '0%' },
          ]}
        />

        <Paragraph>
          Clean shipping lanes from Asian fabrication hubs — Taiwan, Japan, South Korea —
          thread through the Strait of Hormuz to Gulf data center sites and onward to
          US facilities. Every route is green. Every metric at baseline.
        </Paragraph>

        <WorldMap />

        <Paragraph>
          This is the world the buildout was priced for. What follows is a scenario
          exploration of what happens when it breaks.
        </Paragraph>
      </Section>
    </>
  );
}
