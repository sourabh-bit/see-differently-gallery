import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import f1 from "@/assets/film-01.jpg";
import f2 from "@/assets/film-02.jpg";
import f3 from "@/assets/film-03.jpg";
import f4 from "@/assets/film-04.jpg";
import f5 from "@/assets/film-05.jpg";
import f6 from "@/assets/film-06.jpg";
import f7 from "@/assets/film-07.jpg";

const strips = [
  { n: "01", title: "Portraits", desc: "Reading faces. Catching the half-second between expressions.", img: f1, h: 78, y: 6 },
  { n: "02", title: "Street", desc: "Anticipating geometry, light and a stranger's stride.", img: f2, h: 92, y: 0 },
  { n: "03", title: "Low Light", desc: "Working with shadow instead of fighting it.", img: f3, h: 70, y: 14 },
  { n: "04", title: "Product", desc: "One object. One light. Infinite restraint.", img: f4, h: 86, y: 4 },
  { n: "05", title: "Travel", desc: "Scale, solitude and the dignity of distance.", img: f5, h: 74, y: 10 },
  { n: "06", title: "Storytelling", desc: "Sequencing frames so they breathe together.", img: f6, h: 96, y: 0 },
  { n: "07", title: "Editing", desc: "Cutting until what's left is the only thing left.", img: f7, h: 80, y: 8 },
];

export function FilmStrip() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="bg-ink text-paper py-32 md:py-48 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="mono text-[11px] tracking-[0.3em] uppercase text-paper/60 mb-6 flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-paper/60" /> 02 — Moments You Will Learn To Capture <span className="w-8 h-px bg-paper/60" />
          </div>
          <h2 className="serif text-6xl md:text-8xl leading-[0.95]">
            Seven frames. <span className="italic">One way</span> of seeing.
          </h2>
        </div>

        <div className="relative h-[70vh] min-h-[520px] flex items-center justify-center gap-3 md:gap-5">
          {strips.map((s, i) => {
            const isActive = active === i;
            const dimmed = active !== null && !isActive;
            return (
              <motion.div
                key={s.n}
                data-cursor="image"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                style={{ height: `${s.h}%`, marginTop: `${s.y}%` }}
                animate={{ scale: isActive ? 1.04 : 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex-1 max-w-[140px] overflow-hidden cursor-none"
              >
                <motion.img
                  src={s.img}
                  alt={s.title}
                  width={400}
                  height={1200}
                  loading="lazy"
                  animate={{ opacity: isActive ? 1 : dimmed ? 0.18 : 0.4 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 w-full h-full object-cover bw-img"
                />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 mono text-[9px] tracking-[0.4em] uppercase text-paper/70">
                  {s.n}
                </div>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="cap"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute bottom-4 left-0 right-0 text-center px-2"
                    >
                      <div className="serif text-base md:text-lg leading-tight">{s.title}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center min-h-[80px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={active ?? "default"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="serif italic text-paper/70 text-lg md:text-xl max-w-2xl mx-auto"
            >
              {active !== null ? strips[active].desc : "Hover a strip — explore the chapters."}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
