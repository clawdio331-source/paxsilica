import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export function DefenseDividendCard() {
  const { metrics } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      className="my-8 py-6 border-t border-border-subtle"
    >
      <h4 className="font-heading text-lg mb-3 text-text-primary">The Defense Dividend</h4>

      <p className="text-[14px] text-text-secondary leading-[1.75] mb-3">
        The UAE intercepted 95%+ of inbound strikes. The Gulf's compute infrastructure
        was stress-tested under live fire and held. This is the first time a major data
        center corridor has been defended in an active conflict.
      </p>

      <p className="text-[14px] text-text-primary leading-[1.75] mb-4">
        The defense dividend is not that the Gulf is safe. It is that the Gulf proved it
        can be defended. This changes the insurance calculus for the entire region and
        makes the case for expanded buildout, not retreat.
      </p>

      <div className="flex items-center gap-6 pt-4 border-t border-border-subtle">
        <div>
          <div className="text-lg font-heading text-text-primary">95%+</div>
          <div className="text-[9px] text-text-muted">Intercept rate</div>
        </div>
        <div>
          <div className="text-lg font-heading text-text-primary">{metrics.defenseConfidence}</div>
          <div className="text-[9px] text-text-muted">Defense confidence</div>
        </div>
        <div>
          <div className="text-lg font-heading text-text-primary">Operational</div>
          <div className="text-[9px] text-text-muted">Facility status</div>
        </div>
      </div>
    </motion.div>
  );
}
