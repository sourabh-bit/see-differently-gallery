import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

type InfoPageShellProps = {
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
};

export function InfoPageShell({ eyebrow, title, lead, children }: InfoPageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink px-6 py-20 text-paper md:px-12 md:py-28">
      <Nav />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.08), transparent 26%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.05), transparent 22%), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 72px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 72px)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 grain opacity-50" />

      <div className="absolute left-6 top-20 z-20 md:left-12 md:top-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-paper/60 transition-colors hover:text-paper"
          aria-label="Back to home"
        >
          <span aria-hidden className="text-lg leading-none">
            ←
          </span>
          <span className="mono text-[10px] tracking-[0.3em] uppercase">Home</span>
        </Link>
      </div>

      <div className="relative mx-auto max-w-7xl pt-24 md:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mono mb-5 text-[10px] tracking-[0.3em] uppercase text-paper/55 md:text-[11px]">
            {eyebrow}
          </div>
          <h1 className="serif text-4xl leading-[0.95] md:text-6xl xl:text-[4.8rem]">{title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-paper/70 md:text-base">
            {lead}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl text-left">{children}</div>
      </div>

      <div className="relative z-10 mt-20">
        <Footer />
      </div>
    </main>
  );
}
