import { useStore } from '../store/useStore';
import { CHECKPOINT_DAYS } from '../lib/metrics';

export function TimelineSlider() {
  const { conflictDay, setConflictDay, checkpointChoices, scrollLocked } = useStore();

  const choiceKeys = ['day30', 'day60', 'day90', 'day120', 'day180'] as const;
  let maxDay = 360;
  for (let i = 0; i < CHECKPOINT_DAYS.length; i++) {
    if (checkpointChoices[choiceKeys[i]] === null) {
      maxDay = CHECKPOINT_DAYS[i];
      break;
    }
  }

  const progress = (conflictDay / 360) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:right-64 z-30">
      <div className="bg-bg-primary/95 backdrop-blur-sm border-t border-border-subtle">
        <div className="max-w-3xl mx-auto px-8 py-4">
          {/* Progress bar with markers */}
          <div className="relative h-6 flex items-center">
            {/* Track background */}
            <div className="absolute inset-x-0 h-px bg-white/[0.08]" />

            {/* Filled track */}
            <div
              className="absolute left-0 h-px transition-all duration-200"
              style={{
                width: `${progress}%`,
                background: 'rgba(255, 255, 255, 0.25)',
              }}
            />

            {/* Checkpoint ticks */}
            {CHECKPOINT_DAYS.map((d) => {
              const pct = (d / 360) * 100;
              const key = choiceKeys[CHECKPOINT_DAYS.indexOf(d)];
              const chosen = checkpointChoices[key] !== null;
              return (
                <div
                  key={d}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${pct}%` }}
                >
                  <div
                    className={`w-1 h-3 rounded-full transition-colors ${
                      chosen ? 'bg-white/40' : 'bg-white/[0.08]'
                    }`}
                  />
                </div>
              );
            })}

            {/* Thumb indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-text-primary transition-all duration-200"
              style={{ left: `${progress}%` }}
            />

            {/* Invisible range input on top */}
            <input
              type="range"
              min={0}
              max={360}
              value={conflictDay}
              onChange={(e) => {
                if (scrollLocked) return;
                setConflictDay(Math.min(Number(e.target.value), maxDay));
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              style={{ height: '24px' }}
            />
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-1">
            <span className="text-[10px] font-mono text-text-muted">0</span>
            <span className="text-[10px] font-mono text-text-muted tabular-nums">
              Day {conflictDay}
            </span>
            <span className="text-[10px] font-mono text-text-muted">360</span>
          </div>
        </div>
      </div>
    </div>
  );
}
