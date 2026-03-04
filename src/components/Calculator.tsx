import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

interface CalculatorProps {
  title: string;
  children: (inputs: Record<string, number>) => React.ReactNode;
  inputs: { key: string; label: string; min: number; max: number; step: number; defaultValue: number; unit: string }[];
}

export function Calculator({ title, children, inputs }: CalculatorProps) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(inputs.map((i) => [i.key, i.defaultValue]))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      className="my-8 py-6 border-t border-border-subtle"
    >
      <h4 className="font-heading text-lg mb-5 text-text-primary">{title}</h4>

      <div className="space-y-4 mb-5">
        {inputs.map((input) => (
          <div key={input.key}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12px] text-text-secondary">{input.label}</label>
              <span className="text-[12px] font-mono text-text-primary">
                {values[input.key]}{input.unit}
              </span>
            </div>
            <input
              type="range"
              min={input.min}
              max={input.max}
              step={input.step}
              value={values[input.key]}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [input.key]: Number(e.target.value) }))
              }
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border-subtle">{children(values)}</div>
    </motion.div>
  );
}

// Insurance Multiplier Calculator
export function InsuranceCalculator() {
  const { metrics } = useStore();

  return (
    <Calculator
      title="The Insurance Multiplier"
      inputs={[
        {
          key: 'premium',
          label: 'Maritime Insurance Premium',
          min: 2,
          max: 90,
          step: 1,
          defaultValue: Math.round(metrics.maritimeInsurance),
          unit: '%',
        },
      ]}
    >
      {(values) => {
        const costIncrease = (values.premium / 2 - 1) * 3.2;
        const perGpu = Math.round(costIncrease * 45);
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xl font-heading text-text-primary">+{costIncrease.toFixed(1)}%</div>
              <div className="text-[10px] text-text-muted mt-1">Per-unit cost increase</div>
            </div>
            <div>
              <div className="text-xl font-heading text-text-primary">+${perGpu}</div>
              <div className="text-[10px] text-text-muted mt-1">Added cost per GPU</div>
            </div>
          </div>
        );
      }}
    </Calculator>
  );
}

// Inventory Cliff Calculator
export function InventoryCalculator() {
  const { metrics, checkpointChoices } = useStore();
  const isContained = checkpointChoices.day30 === 0;

  return (
    <Calculator
      title="The Inventory Cliff"
      inputs={[
        {
          key: 'consumption',
          label: 'Consumption Rate Multiplier',
          min: 1,
          max: 3,
          step: 0.1,
          defaultValue: isContained ? 1.2 : 1.8,
          unit: 'x',
        },
      ]}
    >
      {(values) => {
        const daysLeft = Math.max(0, Math.round(metrics.inventory / values.consumption));
        const categories = [
          { name: 'ABF Substrates', days: Math.round(daysLeft * 0.8) },
          { name: 'High-Purity Chem.', days: Math.round(daysLeft * 0.6) },
          { name: 'CoWoS Capacity', days: Math.round(daysLeft * 1.1) },
        ];
        return (
          <div className="space-y-2.5">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="text-[12px] text-text-secondary w-28 shrink-0">{cat.name}</span>
                <div className="flex-1 h-px bg-white/[0.04] overflow-hidden">
                  <motion.div
                    className="h-full bg-white/20"
                    animate={{ width: `${Math.min(100, (cat.days / 90) * 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-[11px] font-mono text-text-muted w-10 text-right">{cat.days}d</span>
              </div>
            ))}
          </div>
        );
      }}
    </Calculator>
  );
}

// Guidance Gap Calculator
export function GuidanceCalculator() {
  const { metrics } = useStore();

  return (
    <Calculator
      title="The Guidance Gap"
      inputs={[
        {
          key: 'capex',
          label: 'Planned Capex ($B)',
          min: 50,
          max: 250,
          step: 10,
          defaultValue: 150,
          unit: 'B',
        },
      ]}
    >
      {(values) => {
        const deployed = values.capex * (metrics.capexRate / 100);
        const stranded = values.capex - deployed;
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xl font-heading text-text-primary">${Math.round(deployed)}B</div>
              <div className="text-[10px] text-text-muted mt-1">Deployable</div>
            </div>
            <div>
              <div className="text-xl font-heading text-text-primary">${Math.round(stranded)}B</div>
              <div className="text-[10px] text-text-muted mt-1">Stranded</div>
            </div>
            <div>
              <div className="text-xl font-heading text-text-primary">{Math.round(100 - metrics.capexRate)}%</div>
              <div className="text-[10px] text-text-muted mt-1">Gap Rate</div>
            </div>
          </div>
        );
      }}
    </Calculator>
  );
}

// Recovery/Repricing Calculator
export function RecoveryCalculator() {
  const { checkpointChoices, escalationIndex } = useStore();
  const isResolution = checkpointChoices.day180 === 0;

  if (isResolution) {
    return (
      <Calculator
        title="The Recovery Lag"
        inputs={[
          {
            key: 'resolutionDay',
            label: 'Resolution Day',
            min: 180,
            max: 300,
            step: 10,
            defaultValue: 200,
            unit: '',
          },
        ]}
      >
        {(values) => {
          const conflictDays = values.resolutionDay;
          const recovDays = Math.round(conflictDays * (1.5 + escalationIndex));
          const normalDate = conflictDays + recovDays;
          return (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-xl font-heading text-text-primary">{recovDays} days</div>
                <div className="text-[10px] text-text-muted mt-1">Recovery duration</div>
              </div>
              <div>
                <div className="text-xl font-heading text-text-secondary">Day {normalDate}</div>
                <div className="text-[10px] text-text-muted mt-1">Full normalization</div>
              </div>
            </div>
          );
        }}
      </Calculator>
    );
  }

  return (
    <Calculator
      title="The Repricing"
      inputs={[
        {
          key: 'throughput',
          label: 'New Baseline Throughput (%)',
          min: 30,
          max: 80,
          step: 5,
          defaultValue: 55,
          unit: '%',
        },
      ]}
    >
      {(values) => {
        const originalCapex = 710;
        const revisedCapex = Math.round(originalCapex * (values.throughput / 100));
        const timelineMultiplier = (100 / values.throughput).toFixed(1);
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xl font-heading text-text-primary">${revisedCapex}B</div>
              <div className="text-[10px] text-text-muted mt-1">Revised deployable capex</div>
            </div>
            <div>
              <div className="text-xl font-heading text-text-primary">{timelineMultiplier}x</div>
              <div className="text-[10px] text-text-muted mt-1">Timeline extension</div>
            </div>
          </div>
        );
      }}
    </Calculator>
  );
}
