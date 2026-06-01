import { createFileRoute } from "@tanstack/react-router";
import { Cursor } from "@/components/Cursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Philosophy } from "@/components/Philosophy";
import { FilmStrip } from "@/components/FilmStrip";
import { Journey } from "@/components/Journey";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Testimonials } from "@/components/Testimonials";
import { Reserve } from "@/components/Reserve";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "See Differently — Mobile Photography Masterclass" },
      {
        name: "description",
        content:
          "A one-day editorial mobile photography masterclass. Twelve seats. One phone. A different eye.",
      },
      { property: "og:title", content: "See Differently — Mobile Photography Masterclass" },
      {
        property: "og:description",
        content: "One day. One phone. A different eye. A black-and-white masterclass for photographers who want to see, not shoot.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SmoothScroll>
      <Cursor />
      <main className="bg-paper text-ink">
        <Nav />
        <Hero />
        <Marquee />
        <Philosophy />
        <FilmStrip />
        <Journey />
        <BeforeAfter />
        <Testimonials />
        <Reserve />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
