import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getReservation } from "@/lib/reservations.functions";

export const Route = createFileRoute("/reservation/$ref")({
  head: () => ({ meta: [{ title: "Your Reservation — Masterclass" }] }),
  component: ReservationStatus,
});

function ReservationStatus() {
  const { ref } = Route.useParams();
  const fetchRes = useServerFn(getReservation);
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["reservation", ref],
    queryFn: () => fetchRes({ data: { ref } }),
    refetchInterval: 15000,
  });

  if (isLoading) return <Centered>Loading…</Centered>;
  if (!data) {
    return (
      <Centered>
        <p>Reservation not found.</p>
        <Link to="/" className="underline mt-4 inline-block">Back home</Link>
      </Centered>
    );
  }

  const status = data.status;
  const claimed = !!data.claimed_paid_at;

  const statusLabel =
    status === "approved"
      ? "Reserved"
      : status === "rejected"
        ? "Rejected"
        : claimed
          ? "Pending approval"
          : "Awaiting payment";

  const statusColor =
    status === "approved"
      ? "bg-emerald-700 text-paper"
      : status === "rejected"
        ? "bg-red-800 text-paper"
        : "bg-amber-500 text-ink";

  return (
    <main className="min-h-screen bg-paper text-ink py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="mono text-[11px] tracking-[0.3em] uppercase text-graphite hover:text-ink">← Home</Link>

        <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-graphite mt-10 flex items-center gap-3">
          <span className="w-6 md:w-8 h-px bg-ink" /> Reservation
        </div>
        <h1 className="serif text-4xl md:text-7xl leading-[0.95] mt-4">
          {data.name.split(" ")[0]}, <span className="italic">{statusLabel.toLowerCase()}</span>.
        </h1>

        <div className="mt-10 border border-ink/15 bg-bone p-8 md:p-10 grid md:grid-cols-2 gap-6">
          <Field label="Reference" value={data.ref} />
          <div>
            <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-2">Status</div>
            <span className={`inline-block px-3 py-1 mono text-[11px] tracking-[0.3em] uppercase ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
          <Field label="Name" value={data.name} />
          <Field label="Email" value={data.email} />
          <Field label="Phone" value={data.phone} />
          <Field label="Amount" value={`₹${(data.amount_paise / 100).toLocaleString("en-IN")}`} />
        </div>

        {status === "pending" && !claimed && (
          <Link
            to="/payment/$ref"
            params={{ ref }}
            className="mt-8 inline-block bg-ink text-paper px-8 py-5 mono text-[11px] tracking-[0.3em] uppercase hover:bg-graphite"
          >
            Complete payment →
          </Link>
        )}

        {status === "pending" && claimed && (
          <p className="text-graphite mt-8 max-w-xl">
            Payment marked as sent. Sit tight — admin will approve shortly. This page refreshes automatically.
          </p>
        )}

        {status === "approved" && (
          <div className="mt-8 border border-emerald-700/40 bg-emerald-700/10 p-6">
            <p className="serif italic text-xl md:text-2xl">Your seat is confirmed. See you on the day.</p>
            <p className="text-graphite text-sm mt-2">A confirmation will reach you at {data.email}.</p>
          </div>
        )}

        {status === "rejected" && (
          <div className="mt-8 border border-red-800/40 bg-red-800/10 p-6">
            <p className="serif italic text-xl md:text-2xl">Payment could not be verified.</p>
            <p className="text-graphite text-sm mt-2">Reach out via WhatsApp with your reference {data.ref}.</p>
          </div>
        )}

        <button onClick={() => refetch()} className="mt-10 mono text-[10px] tracking-[0.3em] uppercase text-graphite hover:text-ink">
          {isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-1">{label}</div>
      <div className="serif text-xl break-all">{value}</div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <div className="text-center">{children}</div>
    </main>
  );
}
