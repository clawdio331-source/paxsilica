import { useStore } from '../store/useStore';
import { Section, Paragraph, Callout } from '../components/Section';
import { SankeyDiagram } from '../components/SankeyDiagram';

export function Section3DualUse() {
  const { escalationIndex } = useStore();
  const isMild = escalationIndex < 0.3;
  const isSevere = escalationIndex > 0.6;

  return (
    <Section
      id="section-3"
      dayRange="Day 61–90"
      label="Section 3"
      title="The Dual-Use Fork"
    >
      <Paragraph>
        Here is the fact that breaks the narrative of "the AI buildout is unstoppable":
        the same high-purity chemicals used for AI chips go into missile guidance
        systems. The same substrates, the same fabrication capacity, the same supply
        chain. When a conflict demands munitions, the buildout and the war machine are
        competing for the same atoms.
      </Paragraph>

      <Callout type="warning">
        Companies like Resonac face allocation decisions imposed by government
        directive. The Defense Production Act is not a hypothetical — it is a lever
        that has been pulled before, and the current conflict creates the legal and
        political conditions for it to be pulled again.
      </Callout>

      <SankeyDiagram />

      {isMild ? (
        <Paragraph>
          On this path, the Defense Production Act is discussed but not formally
          activated. Defense allocation happens through informal government "requests"
          that companies find difficult to refuse. Commercial allocation drops to roughly
          85% of baseline — painful but survivable. The buildout slows but doesn't break.
        </Paragraph>
      ) : isSevere ? (
        <>
          <Paragraph>
            On this path, the DPA is formally activated. Mandatory allocation percentages
            are imposed on dual-use material producers. Defense takes 25-40% of key
            substrate supply. Commercial allocation craters — some categories hit zero
            availability. This is the scenario that keeps CFOs awake.
          </Paragraph>
          <Callout type="danger">
            When defense allocation exceeds 25%, GPU production schedules become
            physically impossible to maintain. The buildout doesn't just slow — it
            stops for categories dependent on contested materials.
          </Callout>
        </>
      ) : (
        <Paragraph>
          The allocation split is materializing. Defense contracts are absorbing
          an increasing share of dual-use materials. The crossover point — where
          defense allocation starts materially impacting GPU production schedules —
          approaches. The question is no longer if, but when.
        </Paragraph>
      )}

      <Paragraph>
        The capex spenders lose supply to their own government's munitions priorities.
        The irony is structural: the companies building the infrastructure that the
        national security state says it needs are being starved of materials by that
        same national security state's wartime demands.
      </Paragraph>
    </Section>
  );
}
