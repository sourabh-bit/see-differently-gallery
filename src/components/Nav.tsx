export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference text-paper">
      <div className="flex items-center justify-between px-6 md:px-12 py-6">
        <a href="#top" className="serif italic text-xl tracking-tight">
          seen<span className="not-italic">/</span>differently
        </a>
        <nav className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.3em] uppercase">
          <a href="#philosophy">Philosophy</a>
          <a href="#gallery">Gallery</a>
          <a href="#journey">Journey</a>
          <a href="#reserve">Reserve</a>
        </nav>
        <span className="mono text-[11px] tracking-[0.2em] uppercase">Jul 15 · 10:00</span>
      </div>
    </header>
  );
}
