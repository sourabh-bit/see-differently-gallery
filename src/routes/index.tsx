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
import { WhyChooseMe } from "@/components/WhyChooseMe";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Makeup Photography Masterclass — One Day, ₹10,000" },
      {
        name: "description",
        content:
          "A one-day makeup photography masterclass. Twelve seats. Light, skin, texture — taught on the phone you already carry.",
      },
      { property: "og:title", content: "Makeup Photography Masterclass — One Day" },
      {
        property: "og:description",
        content: "One day. One phone. One craft — makeup photography taught from the eye behind the lens.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SmoothScroll>
      <Cursor />
      <main className="bg-paper text-ink w-full">
        <Nav />
        <Hero />
        <Marquee />
        <Philosophy />
        <FilmStrip />
        <Journey />
        <BeforeAfter />
        <WhyChooseMe />
        <Testimonials />
        <Reserve />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
