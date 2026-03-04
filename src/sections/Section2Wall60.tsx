import { useStore } from '../store/useStore';
import { Section, Paragraph, Callout } from '../components/Section';
import { InventoryCalculator } from '../components/Calculator';
import { MetricChart } from '../components/MetricChart';
import { CapitalFlowDiagram } from '../components/CapitalFlowDiagram';
import { RotationCalculator } from '../components/RotationCalculator';

export function Section2Wall60() {
  const { checkpointChoices } = useStore();
  const isContained = checkpointChoices.day30 === 0;

  return (
    <Section
      id="section-2"
      dayRange="Day 31–60"
      label="Section 2"
      title="The 60-Day Wall"
    >
      {isContained ? (
        <>
          <Paragraph>
            Inventory drawdown is orderly but accelerating. Substrate manufacturers —
            <strong>Resonac, Entegris, Ibiden</strong> — report delays but are managing through existing
            stockpiles and partial workarounds. Gulf data center projects are <strong>paused
            but not cancelled</strong>. The market is still pricing in a short disruption.
          </Paragraph>
          <Callout type="info">
            Procurement teams have found partial workarounds through rerouting. The
            Cape route adds cost but maintains flow. Inventory buffers are buying time —
            but the clock is ticking.
          </Callout>
        </>
      ) : (
        <>
          <Paragraph>
            The inventory cliff hits hard. <strong>Resonac, Entegris, and Ibiden issue force
            majeure notices</strong> on select contracts. Gulf data center projects are cancelled
            outright — sunk costs written off in emergency board meetings. The rerouting
            capacity around the Cape is <strong>overwhelmed</strong> as every shipper in the hemisphere
            competes for the same constrained lanes.
          </Paragraph>
          <Callout type="danger">
            Force majeure notices are cascading through the substrate supply chain.
            Companies that depend on just-in-time delivery from contested regions face
            zero-inventory scenarios within weeks.
          </Callout>
        </>
      )}

      <Paragraph>
        This is where inventory buffers run out and physical reality hits. The difference
        between a spreadsheet delay and an empty warehouse becomes visceral. <strong>You cannot
        will silicon into existence.</strong>
      </Paragraph>

      <MetricChart type="throughput" />

      <InventoryCalculator />

      {/* Capital Rotation — the money has to go somewhere */}
      <Paragraph>
        But <strong>the money doesn't disappear</strong>. When hardware capex gets physically
        bottlenecked, capital rotates. The $710B doesn't sit idle — it starts flowing
        toward the supply-chain-agnostic side of the AI trade: <strong>software, inference
        optimization, tooling</strong>. The rotation window is opening.
      </Paragraph>

      <CapitalFlowDiagram />

      <RotationCalculator />

      <Paragraph>
        {isContained
          ? 'The contained scenario buys time — but time is exactly what the buildout cannot afford. Every week of delay compounds into months of missed deployment targets.'
          : 'The spreading scenario collapses the buffer. There is no more time to buy. Every substrate category is in drawdown, and the rate of consumption outpaces the rate of supply.'}
      </Paragraph>
    </Section>
  );
}
