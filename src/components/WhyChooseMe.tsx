const points = [
  {
    n: "01",
    title: "Eight years behind the lens",
    body: "Editorial campaigns for bridal and beauty houses across India. The room knows the work before you walk in.",
  },
  {
    n: "02",
    title: "Built for makeup, not generic portraits",
    body: "Skin tones, highlight transitions, gloss, glitter, fine liner — taught with the look, not at it.",
  },
  {
    n: "03",
    title: "Phone-first, professional output",
    body: "No DSLR required. Lighting, framing and finishing tuned to what your phone already does.",
  },
  {
    n: "04",
    title: "Small room. Real feedback.",
    body: "Capped at twelve. Every shot you take gets reviewed in the same session — no group inbox afterwards.",
  },
];

export function WhyChooseMe() {
  return (
    <section id="why" className="bg-paper py-20 md:py-44 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-graphite mb-8 md:mb-12 flex items-center gap-3 md:gap-4">
          <span className="w-6 md:w-8 h-px bg-ink" /> 04 — Why Choose Me
        </div>

        <h2 className="serif text-5xl sm:text-6xl md:text-[7vw] leading-[0.95] tracking-[-0.02em] max-w-5xl">
          A makeup look deserves a <span className="italic">photograph</span> that survives the screen.
        </h2>

        <div className="mt-14 md:mt-20 grid md:grid-cols-2 gap-10 md:gap-x-20 md:gap-y-16">
          {points.map((p) => (
            <div key={p.n} className="border-t border-ink/15 pt-6">
              <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite">{p.n}</div>
              <h3 className="serif text-2xl md:text-4xl mt-3 leading-tight">{p.title}</h3>
              <p className="text-graphite mt-3 max-w-md text-sm md:text-base">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
