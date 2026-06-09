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
  {
    n: "01",
    title: "Portraits",
    desc: "Reading faces. Catching the half-second between expressions.",
    img: f1,
    y: 6,
  },
  {
    n: "02",
    title: "Street",
    desc: "Anticipating geometry, light and a stranger's stride.",
    img: f2,
    y: -4,
  },
  {
    n: "03",
    title: "Low Light",
    desc: "Working with shadow instead of fighting it.",
    img: f3,
    y: 10,
  },
  { n: "04", title: "Product", desc: "One object. One light. Infinite restraint.", img: f4, y: -8 },
  { n: "05", title: "Travel", desc: "Scale, solitude and the dignity of distance.", img: f5, y: 4 },
  {
    n: "06",
    title: "Storytelling",
    desc: "Sequencing frames so they breathe together.",
    img: f6,
    y: -2,
  },
  {
    n: "07",
    title: "Editing",
    desc: "Cutting until what's left is the only thing left.",
    img: f7,
    y: 8,
  },
];

export function FilmStrip() {
  const [active, setActive] = useState(0);
  const current = strips[active];
  const revealTransition = { duration: 1.35, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section id="gallery" className="bg-ink text-paper py-20 md:py-48 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-paper/60 mb-5 md:mb-6 flex items-center justify-center gap-3 md:gap-4">
            <span className="w-6 md:w-8 h-px bg-paper/60" /> 02 — Moments{" "}
            <span className="w-6 md:w-8 h-px bg-paper/60" />
          </div>
          <h2 className="serif text-4xl sm:text-5xl md:text-8xl leading-[0.95]">
            Seven frames. <span className="italic">One way</span> of seeing.
          </h2>
        </div>

        {/* Mobile: compact feature frame with a thumb rail */}
        <div className="md:hidden">
          <div className="relative overflow-hidden border border-paper/15 bg-[#050505] h-[42vh] min-h-[320px] max-h-[430px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.n}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.img
                  src={current.img}
                  alt={current.title}
                  width={768}
                  height={1024}
                  className="absolute inset-0 h-full w-full object-cover object-center bw-img"
                />
                <motion.img
                  src={current.img}
                  alt={current.title}
                  width={768}
                  height={1024}
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={revealTransition}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.4)_72%,rgba(0,0,0,0.86)_100%),linear-gradient(to_t,rgba(0,0,0,0.82),rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.7))]" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 mono text-[9px] tracking-[0.4em] uppercase text-paper/85">
              {current.n}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.n}
                initial={{ opacity: 0, y: 18, clipPath: "inset(0 0 100% 0 round 0.75rem)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 0.75rem)" }}
                exit={{ opacity: 0, y: 14, clipPath: "inset(0 0 100% 0 round 0.75rem)" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-5 right-5 bottom-5 text-paper"
              >
                <div className="mono text-[8px] tracking-[0.42em] uppercase text-paper/55 mb-2">
                  Chapter {current.n}
                </div>
                <div className="serif text-[2.15rem] leading-[0.88] text-paper">
                  {current.title}
                </div>
                <p className="mt-2 max-w-[26ch] text-paper/78 text-[0.95rem] leading-snug">
                  {current.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {strips.map((s, i) => {
              const isActive = active === i;
              return (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`relative shrink-0 rounded-full border px-3 py-2 mono text-[9px] tracking-[0.3em] uppercase transition-all duration-500 ${
                    isActive
                      ? "border-paper/75 bg-paper text-ink shadow-[0_8px_24px_rgba(255,255,255,0.15)] scale-105"
                      : "border-paper/15 bg-transparent text-paper/55"
                  }`}
                >
                  {s.n}
                </button>
              );
            })}
          </div>
        </div>

        {/* Expanding film strip (desktop only) */}
        <div className="hidden md:flex h-[70vh] md:h-[70vh] min-h-[520px] md:min-h-[480px] border-y border-paper/20 overflow-hidden">
          {strips.map((s, i) => {
            const isActive = active === i;
            return (
              <motion.div
                key={s.n}
                data-cursor="image"
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                animate={{ flex: isActive ? 8 : 1 }}
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
                    scale: isActive ? 1 : 1.34,
                    opacity: 1,
                  }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover bw-img"
                />
                <motion.img
                  src={s.img}
                  alt={s.title}
                  width={768}
                  height={1024}
                  loading="lazy"
                  initial={false}
                  animate={{
                    clipPath: isActive ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                  }}
                  transition={revealTransition}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.12)_48%,rgba(255,255,255,0)_100%)]"
                  animate={{
                    x: isActive ? ["-18%", "118%"] : "-18%",
                    opacity: isActive ? [0, 1, 0] : 0,
                  }}
                  transition={
                    isActive
                      ? { duration: 1.65, ease: [0.22, 1, 0.36, 1], times: [0, 0.55, 1] }
                      : { duration: 0.2 }
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />

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
                      className="absolute bottom-0 left-0 right-0 p-5 md:p-10"
                    >
                      <div className="mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-paper/60 mb-2 md:mb-3">
                        Chapter {s.n}
                      </div>
                      <div className="serif text-3xl md:text-7xl leading-none">{s.title}</div>
                      <p className="mt-2 md:mt-4 max-w-md text-paper/75 text-xs md:text-base">
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
