import { useRef, useState, useEffect } from "react";
import before from "@/assets/before.jpg";
import after from "@/assets/after.jpg";

export function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    const stop = () => setDrag(false);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
    };
  }, []);

  const move = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <section className="bg-paper py-32 md:py-48 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mono text-[11px] tracking-[0.3em] uppercase text-graphite mb-10 flex items-center gap-4">
          <span className="w-8 h-px bg-ink" /> 04 — Same Phone. New Eye.
        </div>
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5 flex flex-col gap-8">
            <h2 className="serif text-5xl md:text-6xl leading-[0.95]">
              Drag to see what one <span className="italic">day</span> changes.
            </h2>
            <p className="text-graphite max-w-sm">
              Both frames were taken with the same phone, in the same room, by the same student — eight hours apart.
            </p>
            <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite">
              Drag the handle ‹›
            </div>
          </div>

          <div
            ref={ref}
            onMouseDown={(e) => { setDrag(true); move(e.clientX); }}
            onMouseMove={(e) => drag && move(e.clientX)}
            onTouchStart={(e) => { setDrag(true); move(e.touches[0].clientX); }}
            onTouchMove={(e) => move(e.touches[0].clientX)}
            className="md:col-span-7 relative w-full aspect-[4/5] md:aspect-[4/5] overflow-hidden select-none border border-ink/20"
            data-cursor="image"
          >
            <img src={after} alt="After" width={1024} height={1024}
                 className="absolute inset-0 w-full h-full object-cover bw-img" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${pos}%` }}
            >
              <img src={before} alt="Before" width={1024} height={1024}
                   className="absolute inset-0 w-full h-full object-cover"
                   style={{ width: `${100 * (100 / Math.max(pos, 0.0001))}%`, maxWidth: "none" }} />
            </div>

            <div
              className="absolute top-0 bottom-0 w-px bg-paper mix-blend-difference"
              style={{ left: `${pos}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full border border-paper bg-ink/40 backdrop-blur-sm flex items-center justify-center mix-blend-difference"
              style={{ left: `${pos}%` }}
            >
              <span className="serif text-paper text-xl leading-none">‹›</span>
            </div>

            <span className="absolute top-4 left-4 mono text-[10px] tracking-[0.3em] uppercase text-paper mix-blend-difference">Before</span>
            <span className="absolute top-4 right-4 mono text-[10px] tracking-[0.3em] uppercase text-paper mix-blend-difference">After</span>
          </div>
        </div>

      </div>
    </section>
  );
}
