export function Marquee() {
  const words = ["See Differently", "—", "Frame the unseen", "—", "Light is the subject", "—", "Mobile, not amateur", "—"];
  const row = [...words, ...words, ...words];
  return (
    <section className="border-y border-ink/15 bg-paper overflow-hidden py-8">
      <div className="flex whitespace-nowrap marquee-track">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="serif italic text-5xl md:text-7xl px-8 text-ink/90">
            {w}
          </span>
        ))}
      </div>
    </section>
  );
}
