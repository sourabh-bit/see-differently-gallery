export function Footer() {
  return (
    <footer className="bg-paper border-t border-ink/15 px-6 md:px-12 py-12 md:py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10">
        <div className="md:col-span-6">
          <div className="serif italic text-4xl md:text-7xl leading-none">seen/differently</div>
          <p className="mt-5 md:mt-6 text-graphite max-w-md text-sm md:text-base">
            A one-day mobile photography masterclass by R. Ardon. Lisbon — recorded for those who can't attend in person.
          </p>
        </div>
        <div className="md:col-span-2 mono text-[11px] tracking-[0.25em] uppercase text-graphite space-y-2">
          <div className="text-ink">Navigate</div>
          <div><a href="#philosophy">Philosophy</a></div>
          <div><a href="#gallery">Gallery</a></div>
          <div><a href="#journey">Journey</a></div>
          <div><a href="#reserve">Reserve</a></div>
        </div>
        <div className="md:col-span-2 mono text-[11px] tracking-[0.25em] uppercase text-graphite space-y-2">
          <div className="text-ink">Contact</div>
          <div>hello@seen.studio</div>
          <div>+351 21 000 0000</div>
        </div>
        <div className="md:col-span-2 mono text-[11px] tracking-[0.25em] uppercase text-graphite space-y-2">
          <div className="text-ink">Follow</div>
          <div>Instagram</div>
          <div>Vimeo</div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 flex flex-wrap items-center justify-between gap-4 mono text-[10px] tracking-[0.3em] uppercase text-graphite border-t border-ink/15 pt-6">
        <span>© 2026 Seen/Differently Studio</span>
        <span>Edition 001 · Lisbon · Jul 15</span>
        <span>All images shot on phone</span>
      </div>
    </footer>
  );
}
