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

  const lines = ["ONE DAY.", "ONE PHONE.", "A DIFFERENT EYE."];

  return (
    <section ref={ref} id="top" className="relative min-h-[110vh] bg-paper grain">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[100vh] pt-32 pb-16 px-6 md:px-12 gap-8">
        {/* Left: typography */}
        <motion.div style={{ opacity: fade }} className="md:col-span-7 flex flex-col justify-center">
          <div className="mono text-[11px] tracking-[0.3em] uppercase text-graphite mb-10">
            <span className="inline-block w-8 h-px bg-ink align-middle mr-3" />
            Mobile Photography Masterclass · 001
          </div>
          <h1 className="serif font-light leading-[0.88] text-[14vw] md:text-[10.5vw] tracking-[-0.04em]">
            {lines.map((line, i) => (
              <motion.span
                key={line}
                style={{
                  x: i === 1 ? driftX : 0,
                  y: i === 2 ? driftY : 0,
                }}
                className="block"
              >
                {line.split("").map((ch, j) => (
                  <motion.span
                    key={j}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{
                      delay: 0.2 + i * 0.15 + j * 0.02,
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </h1>

          <div className="mt-12 max-w-md grid grid-cols-3 gap-6 text-[11px] mono uppercase tracking-[0.2em] text-graphite">
            <div>
              <div className="text-ink serif text-3xl normal-case tracking-normal">07h</div>
              <div className="mt-1">Live session</div>
            </div>
            <div>
              <div className="text-ink serif text-3xl normal-case tracking-normal">12</div>
              <div className="mt-1">Seats only</div>
            </div>
            <div>
              <div className="text-ink serif text-3xl normal-case tracking-normal">∞</div>
              <div className="mt-1">After replay</div>
            </div>
          </div>
        </motion.div>

        {/* Right: portrait */}
        <div className="md:col-span-5 relative">
          <div className="relative h-[60vh] md:h-full overflow-hidden" data-cursor="image">
            <motion.img
              src={portrait}
              alt="Photographer holding smartphone as viewfinder"
              width={1024}
              height={1408}
              style={{ scale: zoom }}
              className="w-full h-full object-cover bw-img"
            />
            <div className="absolute top-4 left-4 mono text-[10px] tracking-[0.25em] uppercase text-paper mix-blend-difference">
              R.A · Frame 014 / Roll 02
            </div>
            <div className="absolute bottom-4 right-4 mono text-[10px] tracking-[0.25em] uppercase text-paper mix-blend-difference">
              ISO 400 · 1/250 · f2.8
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
