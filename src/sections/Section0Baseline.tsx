import { Section, Paragraph, StatGrid } from '../components/Section';
import { WorldMap } from '../components/WorldMap';

export function Section0Baseline() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary" />
        <div className="relative z-10 max-w-3xl">
          <div className="text-[10px] uppercase tracking-[0.4em] text-accent-teal mb-6 font-medium">
            An Interactive Scenario
          </div>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl mb-6 text-text-primary leading-[1.1]">
            Pax Silica
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-4 font-heading italic">
            The Capex Peace Lobby
          </p>
          <p className="text-sm md:text-base text-text-muted max-w-xl mx-auto leading-relaxed mb-10">
            A $700 billion AI infrastructure buildout meets a Middle East conflict.
            Scroll to explore how the economics of artificial intelligence become
            the strongest force for peace.
          </p>
          <div className="flex items-center justify-center gap-2 text-text-muted text-xs animate-bounce">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2V14M8 14L3 9M8 14L13 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Scroll to begin
          </div>
        </div>
      </section>

      {/* Baseline data */}
      <Section
        id="section-0"
        dayRange="Day 0"
        label="The Baseline"
        title="Before Escalation"
      >
        <Paragraph>
          The $710 billion capex commitment across hyperscalers represents the largest
          coordinated infrastructure bet in corporate history. Supply chains run clean.
          Maritime insurance sits at peacetime premiums. The Gulf region positions itself
          as the "New Switzerland" for compute — sovereign wealth funding data center
          campuses from Abu Dhabi to Neom.
        </Paragraph>

        <StatGrid
          stats={[
            { label: 'Total Capex Committed', value: '$710B', sub: 'Across hyperscalers' },
            { label: 'Supply Chain', value: '100%', sub: 'Full throughput' },
            { label: 'Insurance Premium', value: '2%', sub: 'Baseline rate' },
            { label: 'Buildout Delay', value: '0 mo', sub: 'On schedule' },
            { label: 'Air Freight', value: '1.0x', sub: 'Standard rates' },
            { label: 'Defense Allocation', value: '0%', sub: 'No diversion' },
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
