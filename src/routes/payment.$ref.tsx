import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { getReservation, markPaid } from "@/lib/reservations.functions";

export const Route = createFileRoute("/payment/$ref")({
  head: () => ({ meta: [{ title: "Complete Payment — Masterclass" }] }),
  component: PaymentPage,
});

function PaymentPage() {
  const { ref } = Route.useParams();
  const router = useRouter();
  const fetchRes = useServerFn(getReservation);
  const mark = useServerFn(markPaid);
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["reservation", ref],
    queryFn: () => fetchRes({ data: { ref } }),
  });

  const submit = useMutation({
    mutationFn: () => mark({ data: { ref, note } }),
    onSuccess: () => router.navigate({ to: "/reservation/$ref", params: { ref } }),
  });

  if (isLoading) {
    return <Centered>Loading…</Centered>;
  }
  if (!data) {
    return (
      <Centered>
        <p>Reservation not found.</p>
        <Link to="/" className="underline mt-4 inline-block">Back home</Link>
      </Centered>
    );
  }

  if (data.status !== "pending" || data.claimed_paid_at) {
    return (
      <Centered>
        <p className="mb-4">Status already submitted.</p>
        <Link to="/reservation/$ref" params={{ ref }} className="underline">View reservation</Link>
      </Centered>
    );
  }

  const amountRupees = (data.amount_paise / 100).toLocaleString("en-IN");

  const copyUpi = async () => {
    await navigator.clipboard.writeText(data.upi_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="min-h-screen bg-paper text-ink py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="mono text-[11px] tracking-[0.3em] uppercase text-graphite hover:text-ink">← Home</Link>
        <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-graphite mt-10 flex items-center gap-3 md:gap-4">
          <span className="w-6 md:w-8 h-px bg-ink" /> Step 02 — Payment
        </div>
        <h1 className="serif text-4xl md:text-7xl leading-[0.95] mt-4">
          Pay <span className="italic">₹{amountRupees}</span> to confirm.
        </h1>
        <p className="text-graphite mt-4 max-w-xl">
          Hi {data.name.split(" ")[0]} — your seat is held. Pay via any UPI app, then tap “I have paid”. Approval usually within a few hours.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-10 md:gap-16">
          <div className="bg-bone border border-ink/10 p-8 md:p-10">
            <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-4">Scan QR</div>
            <div className="bg-paper p-3 inline-block">
              <img src={data.qr_data_url} alt="UPI payment QR" className="w-full max-w-[280px]" />
            </div>
            <p className="mono text-[10px] tracking-[0.25em] uppercase text-graphite mt-4">
              Any UPI app · GPay · PhonePe · Paytm · BHIM
            </p>
          </div>

          <div className="bg-ink text-paper p-8 md:p-10 flex flex-col gap-6">
            <div>
              <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/60 mb-2">UPI ID</div>
              <div className="serif text-2xl md:text-3xl break-all">{data.upi_id}</div>
              <button
                onClick={copyUpi}
                className="mt-3 mono text-[10px] tracking-[0.3em] uppercase border border-paper/40 px-3 py-1 hover:bg-paper hover:text-ink transition-colors"
              >
                {copied ? "Copied" : "Copy UPI ID"}
              </button>
            </div>
            <div>
              <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/60 mb-2">Amount</div>
              <div className="serif text-2xl md:text-3xl">₹{amountRupees}.00</div>
            </div>
            <div>
              <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/60 mb-2">Reference</div>
              <div className="serif text-2xl md:text-3xl">{data.ref}</div>
              <div className="mono text-[10px] tracking-[0.25em] uppercase text-paper/60 mt-1">
                Use as payment note
              </div>
            </div>
            <a
              href={data.upi_url}
              className="mt-2 inline-block bg-paper text-ink px-6 py-4 text-center mono text-[11px] tracking-[0.3em] uppercase hover:bg-graphite hover:text-paper transition-colors"
            >
              Open in UPI app
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-ink/15 pt-10">
          <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-4">After paying</div>
          <h2 className="serif text-3xl md:text-5xl leading-[0.95]">Confirm <span className="italic">manually</span>.</h2>
          <p className="text-graphite mt-3 max-w-xl">
            Paste your UPI transaction ID or a short note. Admin will verify and approve.
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 400))}
            placeholder="UTR / Txn ID (optional)"
            className="mt-6 w-full bg-transparent border border-ink/30 focus:border-ink outline-none p-4 serif text-lg min-h-[100px]"
          />
          <button
            onClick={() => submit.mutate()}
            disabled={submit.isPending}
            className="mt-6 inline-flex items-center justify-between gap-6 bg-ink text-paper px-8 py-6 hover:bg-graphite transition-colors disabled:opacity-50 w-full md:w-auto"
          >
            <span className="mono text-[11px] tracking-[0.4em] uppercase">
              {submit.isPending ? "Submitting…" : "I have paid"}
            </span>
            <span className="serif text-3xl leading-none">→</span>
          </button>
          {submit.isError && (
            <p className="text-red-700 mt-4 text-sm">Could not submit. Try again.</p>
          )}
        </div>
      </div>
    </main>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <div className="text-center">{children}</div>
    </main>
  );
}
