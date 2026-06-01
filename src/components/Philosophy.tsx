import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const QUOTE = "Photography isn't about equipment. It's about attention.";

function Word({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }} className="inline-block mr-[0.25em]">{children}</motion.span>;
}

export function Philosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.4"] });
  const words = QUOTE.split(" ");

  return (
    <section id="philosophy" className="bg-paper py-32 md:py-48 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mono text-[11px] tracking-[0.3em] uppercase text-graphite mb-12 flex items-center gap-4">
          <span className="w-8 h-px bg-ink" /> 01 — The Philosophy
        </div>

        <div ref={ref} className="serif text-[7vw] md:text-[5vw] leading-[1.05] tracking-[-0.02em] text-balance">
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return <Word key={i} progress={scrollYProgress} range={[start, end]}>{w}</Word>;
          })}
        </div>

        <div className="mt-20 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-5">
            <p className="serif italic text-3xl md:text-4xl leading-snug">
              Your camera is not the problem.
            </p>
            <p className="mt-3 text-graphite max-w-sm">
              Your eye is. And that — unlike a sensor — can be trained in a single, deliberate day.
            </p>
          </div>
          <div className="md:col-span-3 md:col-start-9 text-right">
            <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite">— R. Ardon</div>
            <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite">Photographer · Mentor</div>
          </div>
        </div>
      </div>
    </section>
  );
}
