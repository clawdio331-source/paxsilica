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
      className={`min-h-screen flex flex-col justify-center px-6 md:px-12 py-20 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        viewport={{ once: false, amount: 0.3 }}
        className="max-w-2xl mx-auto w-full"
      >
        {/* Section header */}
        {(dayRange || label) && (
          <div className="flex items-center gap-3 mb-6">
            {dayRange && (
              <span className="text-[10px] font-mono tracking-wider text-accent-teal bg-accent-teal/10 px-2.5 py-1 rounded">
                {dayRange}
              </span>
            )}
            {label && (
              <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
                {label}
              </span>
            )}
          </div>
        )}

        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl mb-6 text-text-primary leading-tight">
          {title}
        </h2>

        <div className="space-y-6">{children}</div>
      </motion.div>
    </section>
  );
}

export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="text-text-secondary text-base md:text-lg leading-relaxed">{children}</p>
  );
}

export function Callout({ children, type = 'info' }: { children: ReactNode; type?: 'info' | 'warning' | 'danger' }) {
  const styles = {
    info: 'border-accent-teal/30 bg-accent-teal/5',
    warning: 'border-accent-amber/30 bg-accent-amber/5',
    danger: 'border-accent-red/30 bg-accent-red/5',
  };

  return (
    <div className={`border-l-2 pl-5 py-3 ${styles[type]} rounded-r-lg`}>
      <div className="text-sm text-text-secondary leading-relaxed">{children}</div>
    </div>
  );
}

export function StatGrid({ stats }: { stats: { label: string; value: string; sub?: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-bg-elevated/50 border border-border-subtle rounded-lg p-4">
          <div className="text-2xl font-heading font-light text-text-primary mb-1">{stat.value}</div>
          <div className="text-[10px] uppercase tracking-wider text-text-muted">{stat.label}</div>
          {stat.sub && <div className="text-[11px] text-text-secondary mt-1">{stat.sub}</div>}
        </div>
      ))}
    </div>
  );
}
