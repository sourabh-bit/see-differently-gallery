import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorMode = "default" | "image" | "cta";

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [mode, setMode] = useState<CursorMode>("default");
  const [flash, setFlash] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      if (!el) return setMode("default");
      if (el.closest("[data-cursor='image']")) setMode("image");
      else if (el.closest("[data-cursor='cta'], a, button")) setMode("cta");
      else setMode("default");
    };
    const click = () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 220);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", click);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", click);
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = mode === "image" ? 96 : mode === "cta" ? 56 : 8;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference"
        style={{ x: sx, y: sy }}
      >
        <motion.div
          animate={{
            width: size,
            height: size,
            x: -size / 2,
            y: -size / 2,
            borderWidth: mode === "default" ? 0 : 1,
            backgroundColor:
              mode === "default" ? "rgb(255,255,255)" : "transparent",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          style={{ borderColor: "white", borderRadius: "9999px" }}
        >
          {mode === "image" && (
            <div className="relative w-full h-full">
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1 h-2 w-px bg-white" />
              <span className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1 h-2 w-px bg-white" />
              <span className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1 w-2 h-px bg-white" />
              <span className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1 w-2 h-px bg-white" />
            </div>
          )}
        </motion.div>
      </motion.div>
      {flash && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[99] bg-white"
          style={{ animation: "flash 220ms ease-out forwards" }}
        />
      )}
      <style>{`@keyframes flash { 0%{opacity:.85} 100%{opacity:0} }`}</style>
    </>
  );
}
