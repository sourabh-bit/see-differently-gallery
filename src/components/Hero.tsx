import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import portrait from "@/assets/hero-portrait.jpg";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const driftX = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const driftY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  

  return (
    <section ref={ref} id="top" className="relative min-h-[100vh] md:min-h-[110vh] bg-paper grain overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[100vh] pt-24 md:pt-32 pb-12 md:pb-16 px-6 md:px-12 gap-10 md:gap-8">
        {/* Left: typography */}
        <motion.div style={{ opacity: fade }} className="md:col-span-7 flex flex-col justify-center min-w-0 order-2 md:order-1">
          <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-graphite mb-6 md:mb-10">
            <span className="inline-block w-6 md:w-8 h-px bg-ink align-middle mr-3" />
            Masterclass · 001
          </div>
          <h1 className="serif font-light leading-[0.9] tracking-[-0.04em]">
            <motion.span
              className="block text-[16vw] md:text-[9.5vw] whitespace-nowrap"
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              ONE DAY.
            </motion.span>
            <motion.span
              style={{ x: driftX }}
              className="block text-[16vw] md:text-[9.5vw] whitespace-nowrap"
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              ONE PHONE.
            </motion.span>
            <motion.span
              style={{ y: driftY }}
              className="block whitespace-nowrap text-[10vw] md:text-[5.4vw] mt-2 md:mt-3 flex items-baseline gap-[0.25em]"
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>A DIFFERENT EYE.</span>
            </motion.span>
          </h1>

          <div className="mt-10 md:mt-12 max-w-md grid grid-cols-3 gap-4 md:gap-6 text-[10px] md:text-[11px] mono uppercase tracking-[0.2em] text-graphite">
            <div>
              <div className="text-ink serif text-2xl md:text-3xl normal-case tracking-normal">07h</div>
              <div className="mt-1">Live session</div>
            </div>
            <div>
              <div className="text-ink serif text-2xl md:text-3xl normal-case tracking-normal">12</div>
              <div className="mt-1">Seats only</div>
            </div>
            <div>
              <div className="text-ink serif text-2xl md:text-3xl normal-case tracking-normal">∞</div>
              <div className="mt-1">After replay</div>
            </div>
          </div>
        </motion.div>

        {/* Right: portrait */}
        <div className="md:col-span-5 relative order-1 md:order-2">
          <div className="relative h-[42vh] md:h-full overflow-hidden" data-cursor="image">
            <motion.img
              src={portrait}
              alt="Photographer holding smartphone as viewfinder"
              width={1024}
              height={1408}
              style={{ scale: zoom }}
              className="w-full h-full object-cover bw-img"
            />
            <div className="absolute top-3 left-3 md:top-4 md:left-4 mono text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-paper mix-blend-difference">
              R.A · Frame 014
            </div>
            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 mono text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-paper mix-blend-difference">
              ISO 400 · f2.8
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal line, like the reference */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-6 md:inset-x-12 bottom-6 h-px"
        viewBox="0 0 1000 1"
        preserveAspectRatio="none"
      >
        <motion.line
          x1="0" y1="0.5" x2="1000" y2="0.5"
          stroke="currentColor" strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 mono text-[10px] tracking-[0.3em] uppercase text-graphite flex flex-col items-center gap-3">
        <span>Scroll</span>
        <span className="block w-px h-10 bg-ink origin-top animate-[scrollline_2s_ease-in-out_infinite]" />
        <style>{`@keyframes scrollline {0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}`}</style>
      </div>
    </section>
  );
}
