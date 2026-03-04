import { Section, Paragraph, Callout } from '../components/Section';
import { InsuranceCalculator } from '../components/Calculator';
import { MetricChart } from '../components/MetricChart';
import { GulfMap } from '../components/GulfMap';
import { DefenseDividendCard } from '../components/DefenseDividend';
import { InlandShiftCalculator } from '../components/InlandShiftCalculator';

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
        because the route is closed, but because <strong>underwriters reprice the risk overnight</strong>.
        Insurance premiums jump before a single cargo ship is touched. This is how
        modern conflicts propagate: <strong>through spreadsheets before they propagate through
        steel</strong>.
      </Paragraph>

      <MetricChart type="insurance" />

      <Paragraph>
        Procurement teams start drawing down existing inventory. The mood across
        hyperscaler boardrooms is cautious optimism — "this will blow over." But beneath
        the surface, logistics teams are already scrambling. <strong>Every day of conflict adds
        cost. Every reroute adds time.</strong> The economics of the buildout begin shifting under
        assumptions that were locked in during peacetime.
      </Paragraph>

      <Callout type="warning">
        The first casualty isn't hardware — it's the insurance market. A 50% jump in
        maritime insurance premiums translates directly to per-unit cost increases on
        every piece of silicon moving through contested waters.
      </Callout>

      <InsuranceCalculator />

      {/* Gulf Regional Stress Test */}
      <DefenseDividendCard />

      <Paragraph>
        Meanwhile in the Gulf, the compute corridor faces its first live stress test.
        Drone strikes target coastal data center nodes in the UAE and Bahrain. But the
        infrastructure holds. <strong>The intercept rate exceeds 95%.</strong> Services go down briefly
        and come back. The Gulf proved it can be defended — and <strong>that changes the calculus</strong>.
      </Paragraph>

      <GulfMap />

      <Paragraph>
        The pie does not shrink. It grows — and it grows inland. Capital that was already
        flowing to KSA accelerates. The geographic center of gravity shifts from coastal
        nodes toward Riyadh, where there is more land, more power headroom, and more
        strategic depth. Bahrain retains its role as a KSA annex.
      </Paragraph>

      <InlandShiftCalculator />
    </Section>
  );
}
