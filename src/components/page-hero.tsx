import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ivory/5 bg-ink pt-40 pb-24">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 left-1/4 size-[500px] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 size-[400px] rounded-full bg-gold/5 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 max-w-4xl text-balance font-serif text-5xl leading-[1.05] md:text-7xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-ivory/60"
          >
            {description}
          </motion.p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
