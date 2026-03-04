import { Section, Paragraph, Callout } from '../components/Section';
import { InsuranceCalculator } from '../components/Calculator';
import { MetricChart } from '../components/MetricChart';

export function Section1First30() {
  return (
    <Section
      id="section-1"
      dayRange="Day 1–30"
      label="Section 1"
      title="The First 30 Days"
    >
      <Paragraph>
        The Strait of Hormuz is contested. Shipping reroutes begin immediately — not
        because the route is closed, but because underwriters reprice the risk overnight.
        Insurance premiums jump before a single cargo ship is touched. This is how
        modern conflicts propagate: through spreadsheets before they propagate through
        steel.
      </Paragraph>

      <MetricChart type="insurance" />

      <Paragraph>
        Procurement teams start drawing down existing inventory. The mood across
        hyperscaler boardrooms is cautious optimism — "this will blow over." But beneath
        the surface, logistics teams are already scrambling. Every day of conflict adds
        cost. Every reroute adds time. The economics of the buildout begin shifting under
        assumptions that were locked in during peacetime.
      </Paragraph>

      <Callout type="warning">
        The first casualty isn't hardware — it's the insurance market. A 50% jump in
        maritime insurance premiums translates directly to per-unit cost increases on
        every piece of silicon moving through contested waters.
      </Callout>

      <InsuranceCalculator />

      <Paragraph>
        The map tells the story. Primary routes through the Gulf shift from green to
        amber. Alternative routes — longer, around the Cape of Good Hope — appear in
        orange. Each reroute adds 14 to 21 days of transit time, compounding delay across
        every procurement cycle.
      </Paragraph>
    </Section>
  );
}
