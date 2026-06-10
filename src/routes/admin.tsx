import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { adminList, adminRefund } from "@/lib/reservations.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin - Reservations" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Row = {
  ref: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  amount_paise: number;
  payment_status: string;
  paid_at: string | null;
  payment_order_id: string | null;
  payment_id: string | null;
  refunded_at: string | null;
  refund_reason: string | null;
  created_at: string;
  updated_at: string;
};

type Filter = "all" | "pending" | "paid" | "refunded";

function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  const list = useServerFn(adminList);
  const refund = useServerFn(adminRefund);

  const load = async (pc: string, f: Filter) => {
    setError(null);
    try {
      const res = await list({ data: { passcode: pc, filter: f } });
      setRows(res.rows as Row[]);
      setAuthed(true);
      sessionStorage.setItem("admin_pc", pc);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reservations.");
      setAuthed(false);
      sessionStorage.removeItem("admin_pc");
    }
  };

  useEffect(() => {
    const pc = sessionStorage.getItem("admin_pc");
    if (pc) {
      setPasscode(pc);
      load(pc, filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authed) load(passcode, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const refundMut = useMutation({
    mutationFn: (v: { ref: string; reason?: string }) =>
      refund({ data: { passcode, ref: v.ref, reason: v.reason } }),
    onSuccess: () => load(passcode, filter),
  });

  if (!authed) {
    return (
      <main className="min-h-screen bg-ink text-paper flex items-center justify-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(passcode, filter);
          }}
          className="max-w-sm w-full"
        >
          <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/60 mb-3">Admin</div>
          <h1 className="serif text-5xl md:text-6xl leading-[0.9] mb-8">
            Enter <span className="italic">passcode</span>.
          </h1>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full bg-transparent border-b border-paper/40 focus:border-paper outline-none serif text-2xl py-2"
            autoFocus
          />
          {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
          <button className="mt-8 bg-paper text-ink px-6 py-4 mono text-[11px] tracking-[0.3em] uppercase hover:bg-bone">
            Unlock &rarr;
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper text-ink px-6 md:px-12 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite">Admin</div>
            <h1 className="serif text-4xl md:text-6xl leading-[0.95]">Reservations</h1>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-graphite">
              Review registrations, payment status, and refund history. This panel no longer makes
              accept/reject decisions.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "paid", "refunded"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`mono text-[10px] tracking-[0.3em] uppercase px-3 py-2 border ${
                  filter === f ? "bg-ink text-paper border-ink" : "border-ink/30 text-graphite hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_pc");
                setAuthed(false);
                setPasscode("");
              }}
              className="mono text-[10px] tracking-[0.3em] uppercase px-3 py-2 border border-ink/30 text-graphite hover:text-ink"
            >
              Lock
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="text-graphite">No reservations in this view.</p>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.ref} className="border border-ink/15 bg-bone p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="serif text-2xl md:text-3xl">{row.name}</div>
                    <div className="mono text-[10px] tracking-[0.2em] uppercase text-graphite">
                      {row.ref}
                    </div>
                  </div>
                  <StatusBadge status={row.payment_status} />
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4 text-sm">
                  <Field label="Email" value={row.email} />
                  <Field label="Phone" value={row.phone} />
                  <Field
                    label="Amount"
                    value={`Rs ${(row.amount_paise / 100).toLocaleString("en-IN")}`}
                  />
                  <Field
                    label="Created"
                    value={new Date(row.created_at).toLocaleString()}
                  />
                  <Field
                    label="Paid at"
                    value={row.paid_at ? new Date(row.paid_at).toLocaleString() : "Not paid yet"}
                  />
                  <Field
                    label="Updated"
                    value={new Date(row.updated_at).toLocaleString()}
                  />
                  <Field label="Order ID" value={row.payment_order_id ?? "Not set"} />
                  <Field label="Payment ID" value={row.payment_id ?? "Not set"} />
                </div>

                {row.notes ? (
                  <div className="mt-5 border-t border-ink/10 pt-4">
                    <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-2">
                      Notes
                    </div>
                    <p className="text-sm leading-6 text-ink/80">{row.notes}</p>
                  </div>
                ) : null}

                {row.refund_reason ? (
                  <div className="mt-5 border-t border-ink/10 pt-4">
                    <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-2">
                      Refund reason
                    </div>
                    <p className="text-sm leading-6 text-ink/80">{row.refund_reason}</p>
                    {row.refunded_at ? (
                      <p className="mt-2 text-xs text-graphite">
                        Refunded at {new Date(row.refunded_at).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={async () => {
                      const reason = window.prompt("Refund note (optional):") ?? undefined;
                      await refundMut.mutateAsync({ ref: row.ref, reason });
                    }}
                    disabled={
                      refundMut.isPending ||
                      row.payment_status === "refunded" ||
                      row.payment_status !== "paid"
                    }
                    className="mono text-[10px] tracking-[0.3em] uppercase px-3 py-2 bg-ink text-paper hover:bg-graphite disabled:opacity-50"
                  >
                    Issue refund
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono text-[10px] tracking-[0.3em] uppercase text-graphite mb-1">{label}</div>
      <div className="serif text-lg break-all">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "paid"
      ? "bg-emerald-700 text-paper"
      : status === "refunded"
        ? "bg-amber-500 text-ink"
        : "bg-ink/10 text-graphite";

  return (
    <span className={`mono text-[10px] tracking-[0.3em] uppercase px-2 py-1 ${cls}`}>{status}</span>
  );
}
