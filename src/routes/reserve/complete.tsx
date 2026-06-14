import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { getReservation } from "@/lib/reservations.functions";

export const Route = createFileRoute("/reserve/complete")({
  component: CompletePage,
});

function CompletePage() {
  const fetchReservation = useServerFn(getReservation);
  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    try {
      setRef(sessionStorage.getItem("seen-reservation-ref"));
    } catch {
      setRef(null);
    }
  }, []);

  const { data, isLoading } = useQuery({
    enabled: !!ref,
    queryKey: ["reservation", ref],
    queryFn: () => fetchReservation({ data: { ref: ref! } }),
    refetchInterval: 15000,
  });

  const status = data?.reservation.status ?? "pending";

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-paper px-6 md:px-12 py-24 md:py-32 grain">
      <div className="absolute left-6 top-6 z-20 md:left-12 md:top-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-paper/60 transition-colors hover:text-paper"
        >
          <span aria-hidden className="text-lg leading-none">&larr;</span>
          <span className="mono text-[10px] tracking-[0.3em] uppercase">Home</span>
        </Link>
      </div>

      <div className="relative mx-auto mt-6 max-w-3xl">
        <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-paper/55 mb-6">
          Reservation status
        </div>

        {!ref ? (
          <h1 className="serif text-5xl md:text-7xl">No reservation found.</h1>
        ) : isLoading || !data ? (
          <h1 className="serif text-5xl md:text-7xl">Loading…</h1>
        ) : status === "approved" ? (
          <>
            <h1 className="serif text-5xl md:text-7xl leading-[0.92]">
              Your seat is <span className="italic">confirmed</span>.
            </h1>
            <p className="mt-5 text-paper/70 text-base md:text-lg">
              We have verified your payment. We will reach out on WhatsApp with class details.
            </p>
          </>
        ) : status === "rejected" ? (
          <>
            <h1 className="serif text-5xl md:text-7xl leading-[0.92]">
              Payment not verified.
            </h1>
            <p className="mt-5 text-paper/70 text-base md:text-lg">
              We couldn't confirm your payment. Please reach out on WhatsApp so we can sort it out.
            </p>
          </>
        ) : (
          <>
            <h1 className="serif text-5xl md:text-7xl leading-[0.92]">
              Payment <span className="italic">pending verification</span>.
            </h1>
            <p className="mt-5 text-paper/70 text-base md:text-lg">
              Thanks{data.reservation.name ? `, ${data.reservation.name}` : ""}. We'll verify your
              UPI payment shortly. This page updates automatically.
            </p>
          </>
        )}

        {data ? (
          <div className="mt-10 rounded-2xl border border-paper/15 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/45">
              Reference
            </div>
            <div className="serif text-2xl mt-1">{data.reservation.ref}</div>
            <div className="mt-3 text-paper/70 text-sm">
              {data.reservation.email} · {data.reservation.phone}
            </div>
            <div className="mt-3 mono text-[10px] tracking-[0.3em] uppercase text-paper/45">
              Status · {status}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
