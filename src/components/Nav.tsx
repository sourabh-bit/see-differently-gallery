import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference text-paper">
      <div className="flex items-center justify-between px-6 md:px-12 py-6">
        <Link to="/" hash="top" className="serif italic text-xl tracking-tight">
          seen<span className="not-italic">/</span>differently
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.3em] uppercase">
          <Link to="/" hash="philosophy">
            Philosophy
          </Link>
          <Link to="/" hash="gallery">
            Gallery
          </Link>
          <Link to="/" hash="journey">
            Journey
          </Link>
          <Link to="/" hash="reserve">
            Reserve
          </Link>
        </nav>
        <span className="mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase">
          Jul 15 Â· 10:00
        </span>
      </div>
    </header>
  );
}
