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
      <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-2">
        Your Path
      </div>
      <div className="flex flex-wrap gap-1.5">
        {choices.map(([key, { day, options }]) => {
          const val = checkpointChoices[key];
          if (val === null) return null;
          const isEscalation = val === 1;
          return (
            <button
              key={key}
              onClick={() => clearChoicesAfter(key)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border transition-colors cursor-pointer ${
                isEscalation
                  ? 'bg-accent-red/10 border-accent-red/30 text-accent-red hover:bg-accent-red/20'
                  : 'bg-accent-green/10 border-accent-green/30 text-accent-green hover:bg-accent-green/20'
              }`}
              title={`Day ${day}: ${options[val]} — Click to revisit`}
            >
              <span className="opacity-60">D{day}</span>
              <span>{options[val]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
