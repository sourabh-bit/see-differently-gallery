import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-paper border-t border-ink/15 px-6 py-12 text-ink md:px-12 md:py-16">
      <div className="mx-auto max-w-7xl space-y-10 md:space-y-12">
        <div className="min-w-0">
          <div className="serif italic text-[1.55rem] leading-none md:text-7xl">
            seen/differently
          </div>
          <p className="mt-3 max-w-full text-[0.78rem] leading-5 text-graphite md:mt-6 md:max-w-md md:text-base md:leading-normal">
            A one-day mobile photography masterclass by R. Ardon. Lisbon - recorded for those who
            can&apos;t attend in person.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-16">
          <div className="order-2 min-w-0 space-y-2 leading-tight mono text-[9px] uppercase tracking-[0.2em] text-graphite md:order-1 md:text-[11px] md:tracking-[0.22em]">
            <div className="text-ink">Contact</div>
            <div>hello@seen.studio</div>
            <div>+351 21 000 0000</div>
            <div className="pt-3">
              <div className="mb-2 text-ink">Follow</div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-graphite transition-colors hover:text-ink"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 shrink-0" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <div className="order-1 min-w-0 space-y-2 leading-tight mono text-[9px] uppercase tracking-[0.2em] text-graphite md:order-2 md:text-[11px] md:tracking-[0.22em]">
            <div className="text-ink">Navigate</div>
            <div>
              <Link to="/" hash="philosophy">
                Philosophy
              </Link>
            </div>
            <div>
              <Link to="/" hash="gallery">
                Gallery
              </Link>
            </div>
            <div>
              <Link to="/" hash="journey">
                Journey
              </Link>
            </div>
            <div>
              <Link to="/" hash="reserve">
                Reserve
              </Link>
            </div>
          </div>

          <div className="order-3 min-w-0 space-y-2 leading-tight mono text-[9px] uppercase tracking-[0.2em] text-graphite md:text-[11px] md:tracking-[0.22em]">
            <div className="text-ink">Pages</div>
            <div>
              <Link to="/course">Course details</Link>
            </div>
            <div>
              <Link to="/pricing">Pricing</Link>
            </div>
            <div>
              <Link to="/contact">Contact</Link>
            </div>
            <div>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </div>
            <div>
              <Link to="/terms-and-conditions">Terms & Conditions</Link>
            </div>
            <div>
              <Link to="/refund-cancellation-policy">Refund policy</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-ink/15 pt-6 mono text-[9px] uppercase tracking-[0.24em] text-graphite md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4 md:text-[10px] md:tracking-[0.3em]">
        <span>(c) 2026 Seen/Differently Studio</span>
        <span>Edition 001 Â· Lisbon Â· Jul 15</span>
        <span>All images shot on phone</span>
      </div>
    </footer>
  );
}
