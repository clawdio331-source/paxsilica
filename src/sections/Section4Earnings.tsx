import { useStore } from '../store/useStore';
import { Section, Paragraph, Callout, StatGrid } from '../components/Section';
import { GuidanceCalculator } from '../components/Calculator';
import { MetricChart } from '../components/MetricChart';

export function Section4Earnings() {
  const { escalationIndex, metrics } = useStore();
  const isMild = escalationIndex < 0.3;
  const isSevere = escalationIndex > 0.6;

  const guidanceRevision = isMild ? '10-15%' : isSevere ? '50%+' : '25-35%';
  const language = isMild
    ? '"Temporary headwind" — manageable optics'
    : isSevere
      ? 'Capex deferrals announced. The narrative takes structural damage.'
      : 'Analyst calls turn hostile. Multiple hyperscalers miss targets.';

  return (
    <Section
      id="section-4"
      dayRange="Day 91–120"
      label="Section 4"
      title="The Quarterly Earnings Problem"
    >
      <Paragraph>
        Q2 earnings season arrives with the buildout behind schedule. <strong>The gap between
        committed capex and deployable capex becomes the story.</strong> Every hyperscaler faces
        the same question on every analyst call: "How much of your capex commitment is
        actually deployable under current conditions?"
      </Paragraph>

      <StatGrid
        stats={[
          {
            label: 'Guidance Revision',
            value: `–${guidanceRevision}`,
            sub: language,
          },
          {
            label: 'Capex Deploy Rate',
            value: `${metrics.capexRate.toFixed(0)}%`,
            sub: 'Of planned deployment',
          },
          {
            label: 'Stranded Capex',
            value: `$${metrics.gap}B`,
            sub: 'Committed but undeployable',
          },
        ]}
      />

      <MetricChart type="capex" />

      {isSevere ? (
        <Callout type="danger">
          At this severity, some hyperscalers announce outright capex deferrals. The
          AI buildout narrative — the thesis that has driven trillions in market
          capitalization — takes structural damage in public markets. This is not a
          speed bump. This is a repricing of the future.
        </Callout>
      ) : (
        <Callout type="warning">
          The guidance gap is widening. Capex committed months ago under peacetime
          assumptions now sits as a liability on the balance sheet. The money is
          allocated but the supply chain cannot absorb it.
        </Callout>
      )}

      <GuidanceCalculator />

      <Paragraph>
        The quarterly reporting cycle does something no amount of strategic patience
        can override: <strong>it forces a public reckoning</strong>. The gap between what was promised
        and what can be delivered is now a number on an earnings slide, and that number
        has consequences <strong>measured in market capitalization</strong>.
      </Paragraph>
    </Section>
  );
}
