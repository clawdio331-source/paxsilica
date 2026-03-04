import { create } from 'zustand';
import { type CheckpointChoices, computeEscalationIndex, computeAllMetrics, type Metrics } from '../lib/metrics';

export interface AppState {
  // Primary state
  conflictDay: number;
  checkpointChoices: CheckpointChoices;

  // UI state
  activeCheckpoint: number | null; // which checkpoint modal is open
  scrollLocked: boolean;
  sidebarExpanded: boolean;

  // Computed
  escalationIndex: number;
  metrics: Metrics;

  // Actions
  setConflictDay: (day: number) => void;
  setCheckpointChoice: (checkpoint: keyof CheckpointChoices, value: 0 | 1) => void;
  clearChoicesAfter: (checkpoint: keyof CheckpointChoices) => void;
  setActiveCheckpoint: (cp: number | null) => void;
  setScrollLocked: (locked: boolean) => void;
  toggleSidebar: () => void;
  resetAll: () => void;
}

const INITIAL_CHOICES: CheckpointChoices = {
  day30: null,
  day60: null,
  day90: null,
  day120: null,
  day180: null,
};

const CHECKPOINT_ORDER: (keyof CheckpointChoices)[] = ['day30', 'day60', 'day90', 'day120', 'day180'];

function recompute(day: number, choices: CheckpointChoices) {
  const ei = computeEscalationIndex(choices);
  return {
    escalationIndex: ei,
    metrics: computeAllMetrics(day, ei),
  };
}

export const useStore = create<AppState>((set) => ({
  conflictDay: 0,
  checkpointChoices: { ...INITIAL_CHOICES },
  activeCheckpoint: null,
  scrollLocked: false,
  sidebarExpanded: false,

  ...recompute(0, INITIAL_CHOICES),

  setConflictDay: (day) =>
    set((state) => ({
      conflictDay: day,
      ...recompute(day, state.checkpointChoices),
    })),

  setCheckpointChoice: (checkpoint, value) =>
    set((state) => {
      const newChoices = { ...state.checkpointChoices, [checkpoint]: value };
      return {
        checkpointChoices: newChoices,
        activeCheckpoint: null,
        scrollLocked: false,
        ...recompute(state.conflictDay, newChoices),
      };
    }),

  clearChoicesAfter: (checkpoint) =>
    set((state) => {
      const idx = CHECKPOINT_ORDER.indexOf(checkpoint);
      const newChoices = { ...state.checkpointChoices };
      for (let i = idx; i < CHECKPOINT_ORDER.length; i++) {
        newChoices[CHECKPOINT_ORDER[i]] = null;
      }
      return {
        checkpointChoices: newChoices,
        ...recompute(state.conflictDay, newChoices),
      };
    }),

  setActiveCheckpoint: (cp) =>
    set({ activeCheckpoint: cp, scrollLocked: cp !== null }),

  setScrollLocked: (locked) => set({ scrollLocked: locked }),

  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),

  resetAll: () =>
    set({
      conflictDay: 0,
      checkpointChoices: { ...INITIAL_CHOICES },
      activeCheckpoint: null,
      scrollLocked: false,
      ...recompute(0, INITIAL_CHOICES),
    }),
}));
