import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { claimReservationPaid, getReservation } from "@/lib/reservations.functions";

export const Route = createFileRoute("/reserve/payment")({
  component: PaymentPage,
});

type Loaded = Awaited<ReturnType<typeof getReservation>>;

function PaymentPage() {
  const navigate = useNavigate();
  const fetchReservation = useServerFn(getReservation);
  const claimPaid = useServerFn(claimReservationPaid);

  const [ref, setRef] = useState<string | null>(null);
  const [data, setData] = useState<Loaded | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let r: string | null = null;
    try {
      r = sessionStorage.getItem("seen-reservation-ref");
    } catch {
      r = null;
    }
    if (!r) {
      window.location.replace("/#reserve");
      return;
    }
    setRef(r);
    fetchReservation({ data: { ref: r } })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load reservation."))
      .finally(() => setLoading(false));
  }, [fetchReservation]);

  const onConfirm = async () => {
    if (!ref) return;
    setSubmitting(true);
    setError(null);
    try {
      await claimPaid({ data: { ref, note: note.trim() } });
      navigate({ to: "/reserve/complete" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit.");
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-paper px-6 md:px-12 py-20 md:py-28 grain">
      <div className="absolute left-6 top-6 z-20 md:left-12 md:top-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-paper/60 transition-colors hover:text-paper"
        >
          <span aria-hidden className="text-lg leading-none">&larr;</span>
          <span className="mono text-[10px] tracking-[0.3em] uppercase">Home</span>
        </Link>
      </div>

      <div className="relative mx-auto mt-6 max-w-5xl">
        <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-paper/55 mb-6">
          UPI Payment
        </div>

        {loading ? (
          <h1 className="serif text-4xl md:text-6xl">Loading your reservation…</h1>
        ) : !data ? (
          <h1 className="serif text-4xl md:text-6xl">{error ?? "Reservation not found."}</h1>
        ) : (
          <>
            <h1 className="serif text-5xl md:text-7xl leading-[0.92]">
              Pay <span className="italic">Rs {data.amountRupees.toLocaleString("en-IN")}</span> to
              reserve.
            </h1>
            <p className="mt-4 text-paper/70 text-base md:text-lg max-w-xl">
              Scan the QR with any UPI app, or pay manually to{" "}
              <span className="text-paper">{data.upiId}</span>. Then tap “I have paid” so we can
              verify and confirm your seat.
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-2 items-start">
              <div className="rounded-2xl border border-paper/15 bg-paper text-ink p-6 flex flex-col items-center">
                <img
                  src={data.qrDataUrl}
                  alt="UPI QR code"
                  className="w-64 h-64 md:w-72 md:h-72"
                />
                <div className="mt-4 text-center">
                  <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite">
                    UPI ID
                  </div>
                  <div className="serif text-2xl mt-1 break-all">{data.upiId}</div>
                </div>
                <a
                  href={data.upiUri}
                  className="mt-5 inline-flex items-center justify-center bg-ink text-paper px-5 py-3 mono text-[11px] tracking-[0.3em] uppercase hover:bg-graphite md:hidden"
                >
                  Open UPI app
                </a>
              </div>

              <div className="rounded-2xl border border-paper/15 bg-white/5 p-6 md:p-8 backdrop-blur-sm">
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/55 mb-3">
                  Reservation
                </div>
                <div className="serif text-3xl">{data.reservation.name}</div>
                <div className="mt-1 text-paper/70 text-sm">
                  {data.reservation.email} · {data.reservation.phone}
                </div>
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/45 mt-4">
                  Ref · {data.reservation.ref}
                </div>

                <label className="block mt-6">
                  <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/55 mb-2">
                    Transaction ID / note (optional)
                  </div>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={200}
                    className="w-full bg-transparent border-b border-paper/30 focus:border-paper outline-none serif text-xl py-2"
                    placeholder="UPI ref no. or any note"
                  />
                </label>

                {error ? <p className="mt-3 text-red-400 text-sm">{error}</p> : null}

                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={submitting}
                  className="mt-6 w-full bg-paper text-ink px-6 py-4 mono text-[11px] tracking-[0.3em] uppercase hover:bg-bone disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "I have paid"}
                </button>
                <p className="mt-3 text-paper/50 text-xs">
                  After you submit, the admin will verify the payment and confirm your seat.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
