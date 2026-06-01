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
  { n: "01", title: "Portraits", desc: "Reading faces. Catching the half-second between expressions.", img: f1 },
  { n: "02", title: "Street", desc: "Anticipating geometry, light and a stranger's stride.", img: f2 },
  { n: "03", title: "Low Light", desc: "Working with shadow instead of fighting it.", img: f3 },
  { n: "04", title: "Product", desc: "One object. One light. Infinite restraint.", img: f4 },
  { n: "05", title: "Travel", desc: "Scale, solitude and the dignity of distance.", img: f5 },
  { n: "06", title: "Storytelling", desc: "Sequencing frames so they breathe together.", img: f6 },
  { n: "07", title: "Editing", desc: "Cutting until what's left is the only thing left.", img: f7 },
];

export function FilmStrip() {
  const [active, setActive] = useState(0);

  return (
    <section id="gallery" className="bg-ink text-paper py-32 md:py-48 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16 gap-8 flex-wrap">
          <div>
            <div className="mono text-[11px] tracking-[0.3em] uppercase text-paper/60 mb-6 flex items-center gap-4">
              <span className="w-8 h-px bg-paper/60" /> 02 — Moments You Will Learn To Capture
            </div>
            <h2 className="serif text-6xl md:text-8xl leading-[0.95] max-w-3xl">
              Seven frames. <span className="italic">One way</span> of seeing.
            </h2>
          </div>
          <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/50">
            Hover · click · explore
          </div>
        </div>

        <div className="flex h-[70vh] min-h-[480px] border-y border-paper/20 overflow-hidden">
          {strips.map((s, i) => {
            const isActive = active === i;
            return (
              <motion.div
                key={s.n}
                data-cursor="image"
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                animate={{ flex: isActive ? 7 : 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative border-r border-paper/15 last:border-r-0 overflow-hidden cursor-none"
              >
                <motion.img
                  src={s.img}
                  alt={s.title}
                  width={768}
                  height={1024}
                  loading="lazy"
                  animate={{
                    scale: isActive ? 1 : 1.4,
                    opacity: isActive ? 1 : 0.35,
                  }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover bw-img"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />

                {/* Vertical strip label (always visible) */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 mono text-[10px] tracking-[0.4em] uppercase text-paper/80">
                  {s.n}
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="absolute bottom-0 left-0 right-0 p-8 md:p-10"
                    >
                      <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/60 mb-3">
                        Chapter {s.n}
                      </div>
                      <div className="serif text-5xl md:text-7xl leading-none">{s.title}</div>
                      <p className="mt-4 max-w-md text-paper/75 text-sm md:text-base">
                        {s.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
