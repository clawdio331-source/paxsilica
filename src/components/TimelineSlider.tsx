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
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="bg-bg-primary/95 backdrop-blur-sm border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-8 py-4">
          {/* Slider label */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-text-muted/60 select-none">
              Drag to scrub timeline
            </span>
            <span className="text-[11px] font-mono text-text-primary tabular-nums font-medium">
              Day {conflictDay}
            </span>
          </div>

          {/* Track */}
          <div className="relative h-8 flex items-center group cursor-grab active:cursor-grabbing">
            {/* Track background */}
            <div className="absolute inset-x-0 h-[3px] bg-white/[0.06] rounded-full" />

            {/* Filled track */}
            <div
              className="absolute left-0 h-[3px] rounded-full transition-all duration-150"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, rgba(56,191,167,0.4), rgba(255,255,255,0.3))',
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
                    className={`w-1 h-4 rounded-full transition-colors ${
                      chosen ? 'bg-white/40' : 'bg-white/[0.12]'
                    }`}
                  />
                </div>
              );
            })}

            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-150 pointer-events-none"
              style={{ left: `${progress}%` }}
            >
              {/* Outer glow */}
              <div className="w-5 h-5 rounded-full bg-accent-teal/20 group-hover:bg-accent-teal/30 transition-colors flex items-center justify-center">
                {/* Inner dot */}
                <div className="w-3 h-3 rounded-full bg-text-primary shadow-[0_0_8px_rgba(56,191,167,0.4)] group-hover:shadow-[0_0_12px_rgba(56,191,167,0.6)] transition-shadow" />
              </div>
            </div>

            {/* Range input overlay */}
            <input
              type="range"
              min={0}
              max={360}
              value={conflictDay}
              onChange={(e) => {
                if (scrollLocked) return;
                setConflictDay(Math.min(Number(e.target.value), maxDay));
              }}
              className="absolute inset-0 w-full opacity-0 cursor-grab active:cursor-grabbing"
              style={{ height: '32px' }}
            />
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-1">
            <span className="text-[10px] font-mono text-text-muted/50">Day 0</span>
            <span className="text-[10px] font-mono text-text-muted/50">Day 360</span>
          </div>
        </div>
      </div>
    </div>
  );
}
