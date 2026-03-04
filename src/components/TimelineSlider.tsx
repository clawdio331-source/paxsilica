import { useStore } from '../store/useStore';
import { CHECKPOINT_DAYS } from '../lib/metrics';

export function TimelineSlider() {
  const { conflictDay, setConflictDay, checkpointChoices, scrollLocked } = useStore();

  // Determine the max day user can slider to (limited by unchosen checkpoints)
  const choiceKeys = ['day30', 'day60', 'day90', 'day120', 'day180'] as const;
  let maxDay = 360;
  for (let i = 0; i < CHECKPOINT_DAYS.length; i++) {
    if (checkpointChoices[choiceKeys[i]] === null) {
      maxDay = CHECKPOINT_DAYS[i];
      break;
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:right-72 z-30 glass-panel border-t border-border-subtle">
      <div className="max-w-4xl mx-auto px-6 py-3">
        <div className="flex items-center gap-4">
          {/* Day labels */}
          <span className="text-[10px] font-mono text-text-muted w-12 shrink-0">Day 0</span>

          {/* Slider with checkpoint markers */}
          <div className="relative flex-1">
            {/* Checkpoint markers */}
            {CHECKPOINT_DAYS.map((d) => {
              const pct = (d / 360) * 100;
              const key = choiceKeys[CHECKPOINT_DAYS.indexOf(d)];
              const chosen = checkpointChoices[key] !== null;
              return (
                <div
                  key={d}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                  style={{ left: `${pct}%` }}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full border-2 ${
                      chosen
                        ? 'bg-accent-teal border-accent-teal'
                        : 'bg-bg-primary border-text-muted'
                    }`}
                  />
                </div>
              );
            })}

            <input
              type="range"
              min={0}
              max={360}
              value={conflictDay}
              onChange={(e) => {
                if (scrollLocked) return;
                const v = Number(e.target.value);
                setConflictDay(Math.min(v, maxDay));
              }}
              className="w-full relative z-10"
            />
          </div>

          <span className="text-[10px] font-mono text-text-muted w-14 shrink-0 text-right">
            Day 360
          </span>
        </div>

        {/* Section labels */}
        <div className="flex justify-between mt-1 text-[9px] text-text-muted">
          <span>Baseline</span>
          <span>First 30</span>
          <span>60-Day Wall</span>
          <span>Dual-Use</span>
          <span>Earnings</span>
          <span>Lobby</span>
          <span>Endgame</span>
        </div>
      </div>
    </div>
  );
}
