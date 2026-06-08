import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import { createReservation } from "@/lib/reservations.functions";

const SEATS_LEFT = 4;
const PRICE = 10000;

export function Reserve() {
  const router = useRouter();
  const create = useServerFn(createReservation);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { ref } = await create({ data: { name, email, phone } });
      router.navigate({ to: "/payment/$ref", params: { ref } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reserve. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <section id="reserve" className="bg-ink text-paper py-24 md:py-48 px-6 md:px-12 grain">
      <div className="max-w-6xl mx-auto">
        <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-paper/60 mb-8 md:mb-10 flex items-center gap-3 md:gap-4">
          <span className="w-6 md:w-8 h-px bg-paper/60" /> 06 — Reserve Your Seat
        </div>

        <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-end mb-12 md:mb-16">
          <h2 className="serif col-span-12 md:col-span-9 text-5xl sm:text-6xl md:text-[9vw] leading-[0.9]">
            <span className="italic">{SEATS_LEFT}</span> seats left.
          </h2>
          <p className="col-span-12 md:col-span-3 text-paper/60 text-sm md:text-base">
            One day. One craft. Twelve students total — capped to keep the room intimate.
          </p>
        </div>

        <motion.div
          whileHover={{ rotateX: 2, rotateY: -2 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          style={{ transformStyle: "preserve-3d", perspective: 1200 }}
          className="relative bg-paper text-ink"
        >
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 hidden md:block">
            <div className="border-t border-dashed border-ink/30" />
          </div>
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ink hidden md:block" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ink hidden md:block" />

          <div className="grid md:grid-cols-12">
            <div className="md:col-span-4 p-7 md:p-12 border-b md:border-b-0 md:border-r border-dashed border-ink/30 flex flex-col justify-between gap-8 md:gap-10">
              <div>
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite">Admit One</div>
                <div className="serif text-4xl md:text-5xl mt-3 leading-none">N°<span className="italic">012</span></div>
              </div>
              <div className="space-y-1">
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite">Date</div>
                <div className="serif text-2xl md:text-3xl leading-none">July 15</div>
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mt-3">Doors</div>
                <div className="serif text-2xl md:text-3xl leading-none">10:00 AM</div>
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mt-3">Fee</div>
                <div className="serif text-2xl md:text-3xl leading-none">₹{PRICE.toLocaleString("en-IN")}</div>
              </div>
              <div className="mono text-[9px] tracking-[0.25em] uppercase text-graphite">
                One full day · UPI payment · Non-transferable
              </div>
            </div>

            <div className="md:col-span-8 p-7 md:p-14">
              <div className="serif text-3xl sm:text-4xl md:text-6xl leading-[0.95]">
                Makeup Photography <span className="italic">Masterclass</span>
              </div>
              <p className="mt-3 md:mt-4 text-graphite max-w-md text-sm md:text-base">
                One day. Light, skin, texture, and the eye behind the lens. Fill in your details — the next screen takes payment via UPI.
              </p>

              <form onSubmit={onSubmit} className="mt-8 md:mt-10 grid gap-6 md:gap-8">
                <label className="block">
                  <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-2">Your name</div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={80}
                    className="w-full bg-transparent border-b border-ink/30 focus:border-ink outline-none serif text-2xl py-2"
                    placeholder="Ananya Sharma"
                  />
                </label>
                <label className="block">
                  <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-2">Email</div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={200}
                    className="w-full bg-transparent border-b border-ink/30 focus:border-ink outline-none serif text-2xl py-2"
                    placeholder="you@studio.com"
                  />
                </label>
                <label className="block">
                  <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-2">WhatsApp number</div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="[0-9+\-\s()]{7,20}"
                    className="w-full bg-transparent border-b border-ink/30 focus:border-ink outline-none serif text-2xl py-2"
                    placeholder="+91 98xxxxxx12"
                  />
                </label>

                {error && <p className="text-red-700 text-sm">{error}</p>}

                <button
                  type="submit"
                  data-cursor="cta"
                  disabled={submitting}
                  className="group mt-2 inline-flex items-center justify-between gap-6 bg-ink text-paper px-8 py-6 hover:bg-graphite transition-colors w-full md:w-auto disabled:opacity-60"
                >
                  <span className="mono text-[11px] tracking-[0.4em] uppercase">
                    {submitting ? "Holding seat…" : `Reserve · pay ₹${PRICE.toLocaleString("en-IN")}`}
                  </span>
                  <span className="serif text-3xl leading-none transition-transform group-hover:translate-x-2">→</span>
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
