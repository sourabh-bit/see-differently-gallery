import { motion } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";

import { createReservation } from "@/lib/reservations.functions";

const WORKSHOP_PRICE = 10000;
const SEATS_LEFT = 4;
const SERVER_FN_TIMEOUT_MS = 20_000;

function safeSetSessionItem(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Ignore browser storage restrictions.
  }
}

function withTimeout<T>(promise: Promise<T>, label: string, timeoutMs = SERVER_FN_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => {
        reject(new Error(`${label} took too long. Please try again.`));
      }, timeoutMs);
    }),
  ]);
}

export function Reserve() {
  const createReservationFn = useServerFn(createReservation);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const draft = {
      name: name.trim(),
      email: email.trim(),
      whatsapp: phone.trim(),
      notes: notes.trim(),
    };

    try {
      const reservation = await withTimeout(
        createReservationFn({ data: draft }),
        "Saving your reservation",
      );
      safeSetSessionItem("seen-reservation-draft", JSON.stringify(draft));
      safeSetSessionItem("seen-reservation-ref", reservation.ref);
      window.location.assign("/reserve/payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reserve. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <section id="reserve" className="bg-ink text-paper py-24 md:py-48 px-6 md:px-12 grain">
      <div className="max-w-6xl mx-auto">
        <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-paper/60 mb-8 md:mb-10 flex items-center gap-3 md:gap-4">
          <span className="w-6 md:w-8 h-px bg-paper/60" /> 06 - Reserve Your Seat
        </div>

        <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-end mb-12 md:mb-16">
          <h2 className="serif col-span-12 md:col-span-9 text-5xl sm:text-6xl md:text-[9vw] leading-[0.9]">
            <span className="italic">{SEATS_LEFT}</span> seats left.
          </h2>
          <div className="col-span-12 md:col-span-3 space-y-3">
            <p className="text-paper/60 text-sm md:text-base">
              Workshop price is{" "}
              <span className="text-paper">Rs {WORKSHOP_PRICE.toLocaleString()}</span>.
            </p>
            <p className="text-paper/60 text-sm md:text-base">
              Reserve your seat, then continue to UPI payment. Admin verifies and confirms.
            </p>
          </div>
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
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite">
                  Admit One
                </div>
                <div className="serif text-4xl md:text-5xl mt-3 leading-none">
                  N0<span className="italic">12</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite">
                  Date
                </div>
                <div className="serif text-2xl md:text-3xl leading-none">July 15</div>
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mt-3">
                  Doors
                </div>
                <div className="serif text-2xl md:text-3xl leading-none">10:00 AM</div>
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mt-3">
                  Fee
                </div>
                <div className="serif text-2xl md:text-3xl leading-none">
                  Rs {WORKSHOP_PRICE.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="mono text-[9px] tracking-[0.25em] uppercase text-graphite">
                Non-transferable - Lifetime replay
              </div>
            </div>

            <div className="md:col-span-8 p-7 md:p-14">
              <div className="serif text-3xl sm:text-4xl md:text-6xl leading-[0.95]">
                Mobile Photography <span className="italic">Masterclass</span>
              </div>
              <p className="mt-3 md:mt-4 text-graphite max-w-md text-sm md:text-base">
                Enter your details to reserve a seat, then pay Rs 10,000 via UPI.
              </p>

              <form onSubmit={onSubmit} className="mt-8 md:mt-10 grid gap-6 md:gap-8">
                <label className="block">
                  <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-2">
                    Your name
                  </div>
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
                  <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-2">
                    Email
                  </div>
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
                  <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-2">
                    WhatsApp number
                  </div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="[0-9+\-\s()]{7,20}"
                    className="w-full bg-transparent border-b border-ink/30 focus:border-ink outline-none serif text-2xl py-2"
                    placeholder="+91 98xxxxxx12"
                  />
                </label>

                <label className="block">
                  <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-2">
                    Notes
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full min-h-24 bg-transparent border-b border-ink/30 focus:border-ink outline-none serif text-xl py-2 resize-none"
                    placeholder="Tell us anything we should know"
                  />
                </label>

                {error ? <p className="text-red-700 text-sm">{error}</p> : null}

                <button
                  type="submit"
                  data-cursor="cta"
                  disabled={submitting}
                  className="group mt-2 inline-flex items-center justify-between gap-6 bg-ink text-paper px-8 py-6 hover:bg-graphite transition-colors w-full md:w-auto disabled:opacity-60"
                >
                  <span className="mono text-[11px] tracking-[0.4em] uppercase">
                    {submitting ? "Holding seat..." : "Continue to Payment"}
                  </span>
                  <span className="serif text-3xl leading-none transition-transform group-hover:translate-x-2">
                    -&gt;
                  </span>
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
