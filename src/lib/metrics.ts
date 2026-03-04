// Metric calculation engine
// All metrics are functions of (conflictDay, escalationIndex)
// escalationIndex is 0-1, computed from weighted checkpoint choices

export interface CheckpointChoices {
  day30: 0 | 1 | null;  // 0=Contained, 1=Spreading
  day60: 0 | 1 | null;  // 0=Diplomatic, 1=Strait Closed
  day90: 0 | 1 | null;  // 0=Proxy Stalemate, 1=Direct Engagement
  day120: 0 | 1 | null; // 0=DPA Activated, 1=Market Rationing
  day180: 0 | 1 | null; // 0=Resolution, 1=Permanent Restructuring
}

export const CHECKPOINT_WEIGHTS = {
  day30: 0.15,
  day60: 0.35,
  day90: 0.20,
  day120: 0.10,
  day180: 0.20,
} as const;

export const CHECKPOINT_DAYS = [30, 60, 90, 120, 180] as const;

export function computeEscalationIndex(choices: CheckpointChoices): number {
  let total = 0;
  let weightSum = 0;

  if (choices.day30 !== null) {
    total += choices.day30 * CHECKPOINT_WEIGHTS.day30;
    weightSum += CHECKPOINT_WEIGHTS.day30;
  }
  if (choices.day60 !== null) {
    total += choices.day60 * CHECKPOINT_WEIGHTS.day60;
    weightSum += CHECKPOINT_WEIGHTS.day60;
  }
  if (choices.day90 !== null) {
    total += choices.day90 * CHECKPOINT_WEIGHTS.day90;
    weightSum += CHECKPOINT_WEIGHTS.day90;
  }
  if (choices.day120 !== null) {
    total += choices.day120 * CHECKPOINT_WEIGHTS.day120;
    weightSum += CHECKPOINT_WEIGHTS.day120;
  }
  if (choices.day180 !== null) {
    total += choices.day180 * CHECKPOINT_WEIGHTS.day180;
    weightSum += CHECKPOINT_WEIGHTS.day180;
  }

  // Normalize to the range of choices made so far
  return weightSum > 0 ? total / weightSum : 0;
}

// Clamp helper
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Smooth S-curve (logistic)
function sigmoid(x: number, midpoint: number, steepness: number): number {
  return 1 / (1 + Math.exp(-steepness * (x - midpoint)));
}

/**
 * Maritime Insurance Premium (%)
 * Exponential ramp, steepness proportional to ei
 * ei=0: plateaus ~30%, ei=1: goes parabolic past 80%
 */
export function maritimeInsurancePremium(day: number, ei: number): number {
  if (day <= 0) return 2; // baseline ~2%
  const base = 2;
  const maxPremium = 30 + ei * 60; // 30% at ei=0, 90% at ei=1
  const rampSpeed = 0.015 + ei * 0.025;
  const premium = base + (maxPremium - base) * (1 - Math.exp(-rampSpeed * day));
  return clamp(Math.round(premium * 10) / 10, 2, 95);
}

/**
 * Air Freight Cost Multiplier
 * Ramps from 1.0x to 3-8x depending on escalation
 */
export function airFreightMultiplier(day: number, ei: number): number {
  if (day <= 0) return 1.0;
  const maxMult = 2.5 + ei * 5.5; // 2.5x at ei=0, 8x at ei=1
  const rampSpeed = 0.012 + ei * 0.015;
  const mult = 1 + (maxMult - 1) * (1 - Math.exp(-rampSpeed * day));
  return Math.round(mult * 10) / 10;
}

/**
 * Supply Chain Throughput (% of baseline)
 * S-curve degradation. Higher ei = faster & deeper drop
 * ei=0: floors ~70%, ei=1: floors ~30%
 */
export function supplyChainThroughput(day: number, ei: number): number {
  if (day <= 0) return 100;
  const floor = 70 - ei * 40; // 70% at ei=0, 30% at ei=1
  const midpoint = 60 - ei * 25; // inflection shifts earlier with higher ei
  const steepness = 0.04 + ei * 0.03;
  const drop = sigmoid(day, midpoint, steepness);
  const throughput = 100 - (100 - floor) * drop;
  return clamp(Math.round(throughput * 10) / 10, floor, 100);
}

/**
 * Dual-Use Defense Allocation (%)
 * Step function with ei-dependent step size
 * Mild paths: 5-15%, Severe: 30-50%
 */
export function dualUseDefenseAllocation(day: number, ei: number): number {
  if (day <= 0) return 0;
  const maxAlloc = 5 + ei * 45; // 5% at ei=0, 50% at ei=1
  const onset = 60 - ei * 30; // starts earlier with higher ei
  if (day < onset) return clamp(Math.round(ei * 5 * (day / onset) * 10) / 10, 0, maxAlloc);
  const ramp = sigmoid(day - onset, 30, 0.08);
  return clamp(Math.round(maxAlloc * ramp * 10) / 10, 0, 50);
}

/**
 * Capex Deployment Rate (% of planned)
 * Linear then accelerating decline
 */
export function capexDeploymentRate(day: number, ei: number): number {
  if (day <= 0) return 100;
  const accelPoint = 90 - ei * 40; // acceleration earlier with higher ei
  const floor = 50 - ei * 35; // 50% at ei=0, 15% at ei=1
  if (day < accelPoint) {
    const linearDrop = (100 - floor) * 0.3 * (day / accelPoint);
    return clamp(Math.round((100 - linearDrop) * 10) / 10, floor, 100);
  }
  const remaining = 100 - (100 - floor) * 0.3;
  const accelDrop = (remaining - floor) * sigmoid(day - accelPoint, 60, 0.04);
  return clamp(Math.round((remaining - accelDrop) * 10) / 10, floor, 100);
}

/**
 * Buildout Delay (months)
 * Accumulates with conflict duration and escalation
 */
export function buildoutDelay(day: number, ei: number): number {
  if (day <= 0) return 0;
  const maxDelay = 3 + ei * 15; // 3 months at ei=0, 18 months at ei=1
  const rampSpeed = 0.008 + ei * 0.008;
  const delay = maxDelay * (1 - Math.exp(-rampSpeed * day));
  return Math.round(delay * 10) / 10;
}

/**
 * Inventory Days Remaining
 * Starts at ~90 days and depletes
 */
export function inventoryDaysRemaining(day: number, ei: number): number {
  if (day <= 0) return 90;
  const consumptionRate = 1 + ei * 1.5; // faster consumption with higher ei
  const remaining = 90 - day * consumptionRate * (90 / 360);
  return clamp(Math.round(remaining), 0, 90);
}

/**
 * Guidance Gap (stranded capex in $B)
 */
export function guidanceGap(day: number, ei: number, plannedCapex: number = 710): number {
  if (day <= 0) return 0;
  const deploymentRate = capexDeploymentRate(day, ei) / 100;
  const gapPct = 1 - deploymentRate;
  const prorated = plannedCapex * (day / 360);
  return Math.round(prorated * gapPct);
}

/**
 * Lobby Pressure Index (0-100)
 * Gradual build with inflection at earnings season (~Day 90)
 */
export function lobbyPressureIndex(day: number, ei: number): number {
  if (day <= 0) return 0;
  const peak = 40 + ei * 60; // 40 at ei=0, 100 at ei=1
  const earningsInflection = sigmoid(day, 90, 0.05);
  const timeRamp = Math.min(day / 180, 1);
  const pressure = peak * (0.3 * timeRamp + 0.7 * earningsInflection);
  return clamp(Math.round(pressure), 0, 100);
}

/**
 * Recovery Lag (days to normalize post-resolution)
 * 1.5-2.5x conflict duration depending on ei
 */
export function recoveryLag(day: number, ei: number): number {
  if (day <= 0) return 0;
  const multiplier = 1.5 + ei * 1.0;
  return Math.round(day * multiplier);
}

/**
 * Get all metrics as an object
 */
export interface Metrics {
  maritimeInsurance: number;
  airFreight: number;
  throughput: number;
  defenseAllocation: number;
  capexRate: number;
  delay: number;
  inventory: number;
  gap: number;
  lobbyPressure: number;
  recovery: number;
}

export function computeAllMetrics(day: number, ei: number): Metrics {
  return {
    maritimeInsurance: maritimeInsurancePremium(day, ei),
    airFreight: airFreightMultiplier(day, ei),
    throughput: supplyChainThroughput(day, ei),
    defenseAllocation: dualUseDefenseAllocation(day, ei),
    capexRate: capexDeploymentRate(day, ei),
    delay: buildoutDelay(day, ei),
    inventory: inventoryDaysRemaining(day, ei),
    gap: guidanceGap(day, ei),
    lobbyPressure: lobbyPressureIndex(day, ei),
    recovery: recoveryLag(day, ei),
  };
}
