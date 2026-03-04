import { useStore } from '../store/useStore';
import type { CheckpointChoices } from '../lib/metrics';

const CHECKPOINT_LABELS: Record<
  keyof CheckpointChoices,
  { day: number; options: [string, string] }
> = {
  day30: { day: 30, options: ['Contained', 'Spreading'] },
  day60: { day: 60, options: ['Diplomatic', 'Strait Closed'] },
  day90: { day: 90, options: ['Stalemate', 'Direct'] },
  day120: { day: 120, options: ['DPA', 'Market Ration.'] },
  day180: { day: 180, options: ['Resolution', 'Restructuring'] },
};

export function PathHistory() {
  const { checkpointChoices, clearChoicesAfter } = useStore();

  const choices = Object.entries(CHECKPOINT_LABELS) as [
    keyof CheckpointChoices,
    { day: number; options: [string, string] },
  ][];

  const anyChosen = choices.some(([key]) => checkpointChoices[key] !== null);

  if (!anyChosen) return null;

  return (
    <div className="mb-3">
      <div className="text-[9px] font-mono text-text-muted mb-2 uppercase tracking-wider">
        Path
      </div>
      <div className="space-y-1">
        {choices.map(([key, { day, options }]) => {
          const val = checkpointChoices[key];
          if (val === null) return null;
          return (
            <button
              key={key}
              onClick={() => clearChoicesAfter(key)}
              className="block w-full text-left text-[11px] text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
              title={`Day ${day}: ${options[val]} — Click to revisit`}
            >
              <span className="font-mono text-text-muted/60">D{day}</span>{' '}
              <span className={val === 1 ? 'text-accent-red/70' : 'text-accent-green/70'}>
                {options[val]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
