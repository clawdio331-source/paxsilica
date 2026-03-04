import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  dayRange?: string;
  label?: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, dayRange, label, title, children, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      className={`min-h-screen flex flex-col justify-center px-6 md:px-12 py-24 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: false, amount: 0.25 }}
        className="max-w-[38rem] mx-auto w-full"
      >
        {/* Section header — minimal */}
        {dayRange && (
          <div className="mb-8">
            <span className="text-[11px] font-mono text-text-muted tracking-wide">
              {dayRange}
            </span>
          </div>
        )}

        <h2 className="font-heading text-2xl md:text-[2rem] lg:text-[2.5rem] mb-8 leading-[1.15]">
          {title}
        </h2>

        <div className="space-y-7">{children}</div>
      </motion.div>
    </section>
  );
}

export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="text-[15px] md:text-base text-text-secondary leading-[1.8] tracking-[-0.005em]">
      {children}
    </p>
  );
}

export function Callout({ children, type = 'info' }: { children: ReactNode; type?: 'info' | 'warning' | 'danger' }) {
  const borderColors = {
    info: 'border-text-muted/20',
    warning: 'border-accent-amber/30',
    danger: 'border-accent-red/30',
  };

  return (
    <div className={`border-l ${borderColors[type]} pl-5 py-1`}>
      <div className="text-[14px] text-text-secondary/80 leading-[1.75] italic">{children}</div>
    </div>
  );
}

export function StatGrid({ stats }: { stats: { label: string; value: string; sub?: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-x-8 gap-y-6 my-10 py-8 border-y border-border-subtle">
      {stats.map((stat) => (
        <div key={stat.label}>
          <div className="text-xl md:text-2xl font-heading font-light text-text-primary">{stat.value}</div>
          <div className="text-[11px] text-text-muted mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
