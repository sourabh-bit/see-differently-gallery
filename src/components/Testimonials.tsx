const items = [
  {
    quote: "I stopped chasing better gear after one afternoon with him.",
    name: "Lena V.",
    role: "Architect, Lisbon",
  },
  {
    quote: "He didn't teach me photography. He taught me how to look.",
    name: "Marc D.",
    role: "Brand Director, Berlin",
  },
  {
    quote: "The most valuable seven hours I've ever paid for.",
    name: "Aisha N.",
    role: "Independent Editor, Cairo",
  },
];

export function Testimonials() {
  return (
    <section className="bg-bone py-20 md:py-44 px-6 md:px-12 border-y border-ink/10">
      <div className="max-w-7xl mx-auto">
        <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-graphite mb-10 md:mb-16 flex items-center gap-3 md:gap-4">
          <span className="w-6 md:w-8 h-px bg-ink" /> 05 — Voices
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-20">
          {items.map((t, i) => (
            <figure key={i} className="flex flex-col gap-5 md:gap-8">
              <div className="serif text-7xl md:text-7xl leading-none text-ink/80">"</div>
              <blockquote className="serif italic text-xl md:text-3xl leading-snug">
                {t.quote}
              </blockquote>
              <figcaption className="mono text-[10px] tracking-[0.3em] uppercase text-graphite border-t border-ink/20 pt-4">
                {t.name} · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
