import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { adminList, adminDecide } from "@/lib/reservations.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Reservations" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Row = {
  ref: string;
  name: string;
  email: string;
  phone: string;
  amount_paise: number;
  status: string;
  claimed_paid_at: string | null;
  payment_note: string | null;
  decided_at: string | null;
  created_at: string;
};

type Filter = "all" | "pending" | "approved" | "rejected" | "claimed";

function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [filter, setFilter] = useState<Filter>("claimed");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  const list = useServerFn(adminList);
  const decide = useServerFn(adminDecide);

  const load = async (pc: string, f: Filter) => {
    setError(null);
    try {
      const res = await list({ data: { passcode: pc, filter: f } });
      setRows(res.rows as Row[]);
      setAuthed(true);
      sessionStorage.setItem("admin_pc", pc);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
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

  const decideMut = useMutation({
    mutationFn: (v: { ref: string; decision: "approved" | "rejected" }) =>
      decide({ data: { passcode, ref: v.ref, decision: v.decision } }),
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
            Unlock →
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
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["claimed", "pending", "approved", "rejected", "all"] as Filter[]).map((f) => (
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
          <div className="border border-ink/15">
            {rows.map((r) => (
              <div key={r.ref} className="border-b border-ink/10 last:border-b-0 p-5 md:p-6 grid md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-3">
                  <div className="serif text-xl">{r.name}</div>
                  <div className="mono text-[10px] tracking-[0.2em] uppercase text-graphite mt-1">{r.ref}</div>
                </div>
                <div className="md:col-span-3 text-sm">
                  <div>{r.email}</div>
                  <div className="text-graphite">{r.phone}</div>
                </div>
                <div className="md:col-span-3 text-xs text-graphite">
                  <div>Created: {new Date(r.created_at).toLocaleString()}</div>
                  {r.claimed_paid_at && <div>Paid claim: {new Date(r.claimed_paid_at).toLocaleString()}</div>}
                  {r.payment_note && <div className="mt-1 text-ink">Note: {r.payment_note}</div>}
                </div>
                <div className="md:col-span-3 flex items-center justify-end gap-2 flex-wrap">
                  <StatusBadge status={r.status} claimed={!!r.claimed_paid_at} />
                  {r.status !== "approved" && (
                    <button
                      disabled={decideMut.isPending}
                      onClick={() => decideMut.mutate({ ref: r.ref, decision: "approved" })}
                      className="mono text-[10px] tracking-[0.3em] uppercase px-3 py-2 bg-emerald-700 text-paper hover:bg-emerald-800 disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button
                      disabled={decideMut.isPending}
                      onClick={() => decideMut.mutate({ ref: r.ref, decision: "rejected" })}
                      className="mono text-[10px] tracking-[0.3em] uppercase px-3 py-2 border border-red-800 text-red-800 hover:bg-red-800 hover:text-paper disabled:opacity-50"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function StatusBadge({ status, claimed }: { status: string; claimed: boolean }) {
  const label = status === "pending" ? (claimed ? "Claimed paid" : "Awaiting payment") : status;
  const cls =
    status === "approved"
      ? "bg-emerald-700 text-paper"
      : status === "rejected"
        ? "bg-red-800 text-paper"
        : claimed
          ? "bg-amber-500 text-ink"
          : "bg-ink/10 text-graphite";
  return <span className={`mono text-[10px] tracking-[0.3em] uppercase px-2 py-1 ${cls}`}>{label}</span>;
}
