import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import j1 from "@/assets/journey-01.jpg";
import j2 from "@/assets/journey-02.jpg";
import j3 from "@/assets/journey-03.jpg";
import j4 from "@/assets/film-03.jpg";
import j5 from "@/assets/film-06.jpg";

const panels = [
  { n: "I", word: "Observe", caption: "Before you raise the phone, raise your attention.", img: j1 },
  { n: "II", word: "Compose", caption: "Geometry, weight, and what you choose to leave out.", img: j2 },
  { n: "III", word: "Capture", caption: "The decisive half-second nobody else noticed.", img: j3 },
  { n: "IV", word: "Edit", caption: "Subtraction is the most underrated camera setting.", img: j4 },
  { n: "V", word: "Share", caption: "Sequence frames into something that lasts.", img: j5 },
];

export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <section id="journey" ref={ref} className="relative h-[500vh] bg-paper">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute top-10 left-6 md:left-12 z-10 mono text-[11px] tracking-[0.3em] uppercase text-graphite flex items-center gap-4">
          <span className="w-8 h-px bg-ink" /> 03 — The Journey
        </div>
        <div className="absolute top-10 right-6 md:right-12 z-10 mono text-[11px] tracking-[0.3em] uppercase text-graphite">
          Scroll →
        </div>

        <motion.div style={{ x }} className="flex h-full will-change-transform">
          {panels.map((p, i) => (
            <div
              key={p.n}
              className="w-screen h-full flex-shrink-0 grid grid-cols-12 items-center px-6 md:px-20 gap-6 md:gap-8 pt-20 md:pt-0"
            >
              <div className="col-span-12 md:col-span-5 flex flex-col gap-3 md:gap-6">
                <div className="serif italic text-lg md:text-2xl text-graphite">{p.n}.</div>
                <h3 className="serif text-[16vw] md:text-[12vw] leading-[0.85] tracking-[-0.03em]">
                  {p.word}.
                </h3>
                <p className="text-graphite max-w-sm text-sm md:text-lg">{p.caption}</p>
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mt-1 md:mt-4">
                  Hour {i + 1} of 7
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 md:col-start-7 h-[34vh] md:h-[70vh] overflow-hidden" data-cursor="image">
                <img
                  src={p.img}
                  alt={p.word}
                  width={1280}
                  height={1024}
                  loading="lazy"
                  className="w-full h-full object-cover bw-img"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
