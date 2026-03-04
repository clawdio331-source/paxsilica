import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export function DefenseDividendCard() {
  const { metrics } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      className="border border-accent-green/20 bg-accent-green/5 rounded-xl p-5 md:p-6 my-6 relative overflow-hidden"
    >
      {/* Shield watermark */}
      <div className="absolute top-4 right-4 opacity-[0.06]">
        <svg width="60" height="70" viewBox="0 0 24 28" fill="currentColor">
          <path d="M12 0L0 5V13C0 20.18 5.12 26.86 12 28C18.88 26.86 24 20.18 24 13V5L12 0Z" />
        </svg>
      </div>

      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.3em] text-accent-green font-semibold mb-3">
          The Defense Dividend
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          The UAE intercepted 95%+ of inbound strikes. The Gulf's compute infrastructure
          was stress-tested under live fire and held. This is the first time a major data
          center corridor has been defended in an active conflict.
        </p>

        <p className="text-sm text-text-primary leading-relaxed mb-4">
          The defense dividend is not that the Gulf is safe. It is that the Gulf proved it
          can be defended. This changes the insurance calculus for the entire region and
          makes the case for expanded buildout, not retreat.
        </p>

        <div className="flex items-center gap-4 pt-3 border-t border-accent-green/15">
          <div>
            <div className="text-lg font-heading text-accent-green">95%+</div>
            <div className="text-[9px] uppercase tracking-wider text-text-muted">Intercept rate</div>
          </div>
          <div>
            <div className="text-lg font-heading text-accent-green">{metrics.defenseConfidence}</div>
            <div className="text-[9px] uppercase tracking-wider text-text-muted">Defense confidence</div>
          </div>
          <div>
            <div className="text-lg font-heading text-accent-teal">Operational</div>
            <div className="text-[9px] uppercase tracking-wider text-text-muted">Facility status</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
