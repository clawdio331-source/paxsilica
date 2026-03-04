import { useStore } from '../store/useStore';
import { Section, Paragraph, Callout } from '../components/Section';
import { RecoveryCalculator } from '../components/Calculator';
import { WorldMap } from '../components/WorldMap';

export function Section6Endgame() {
  const { checkpointChoices } = useStore();
  const isResolution = checkpointChoices.day180 === 0;

  if (isResolution) {
    return (
      <Section
        id="section-6"
        dayRange="Day 181–270"
        label="Section 6"
        title="Pax Silica"
      >
        <Paragraph>
          A resolution emerges — heavy-handed and fast. Framed publicly as energy
          security but fundamentally about silicon logistics. He who controls the
          shipping lanes controls the buildout. The buildout is now indistinguishable
          from the national interest.
        </Paragraph>

        <Callout type="info">
          The peace is not idealistic. It is arithmetic. The capex spenders
          demonstrated that the cost of continued conflict exceeded the political
          cost of resolution. The war ends not because of moral pressure but because
          the spreadsheets demanded it.
        </Callout>

        <WorldMap />

        <Paragraph>
          The map begins to heal. Green lines return. But recovery is asymmetric:
          damage is fast, recovery is slow. A 90-day conflict takes roughly 180 days
          to fully unwind. Insurance markets have long memories. Supply chain trust,
          once broken, rebuilds in quarters, not weeks.
        </Paragraph>

        <RecoveryCalculator />

        <Paragraph>
          The buildout resumes on a delayed timeline. The capex is still committed.
          The deployments still happen. But the calendar has shifted, and with it,
          the competitive dynamics of the AGI race. Time lost is not time recovered —
          it is time conceded.
        </Paragraph>
      </Section>
    );
  }

  return (
    <Section
      id="section-6"
      dayRange="Day 181–270"
      label="Section 6"
      title="The New Map"
    >
      <Paragraph>
        No resolution is in sight. The conflict has become structural — a permanent
        feature of the geopolitical landscape rather than a temporary disruption.
        Supply chains are being permanently rerouted. The Gulf corridor, once the
        backbone of the buildout's logistics, is written off.
      </Paragraph>

      <Callout type="danger">
        Companies are writing off Gulf investments entirely. Billions in committed
        capital for data center campuses from Abu Dhabi to Neom — gone. The "New
        Switzerland for compute" thesis is dead for a generation.
      </Callout>

      <WorldMap />

      <Paragraph>
        The map is redrawn. New supply routes through the Indian Ocean. An expanded
        Pacific corridor. Domestic fabrication accelerated not by industrial policy
        alone but by the sheer necessity of removing the Middle East from the
        critical path.
      </Paragraph>

      <RecoveryCalculator />

      <Paragraph>
        The buildout survives — but it is smaller, slower, more expensive. The $710
        billion commitment gets repriced. The AGI timeline extends. The US cedes
        first-mover advantage not because it chose to but because the supply chain
        forced the choice. This is the new baseline.
      </Paragraph>
    </Section>
  );
}
