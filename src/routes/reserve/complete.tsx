import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type PaymentSummary = {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
  reservationRef: string;
};

export const Route = createFileRoute("/reserve/complete")({
  component: ReserveCompletePage,
});

function ReserveCompletePage() {
  const [payment, setPayment] = useState<PaymentSummary | null>(null);

  useEffect(() => {
    let paymentRaw: string | null = null;
    try {
      paymentRaw = sessionStorage.getItem("seen-razorpay-payment");
    } catch {
      paymentRaw = null;
    }

    if (!paymentRaw) return;

    try {
      setPayment(JSON.parse(paymentRaw) as PaymentSummary);
    } catch {
      setPayment(null);
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-paper px-6 md:px-12 py-24 md:py-32">
      <div className="absolute left-6 top-6 z-20 md:left-12 md:top-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-paper/60 transition-colors hover:text-paper"
        >
          <span aria-hidden className="text-lg leading-none">
            &larr;
          </span>
          <span className="mono text-[10px] tracking-[0.3em] uppercase">Home</span>
        </Link>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(255,255,255,0.08), transparent 28%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.05), transparent 24%), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 72px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 72px)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 grain opacity-50" />

      <div className="relative mx-auto mt-6 max-w-7xl">
        <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-paper/55 mb-6">
          Reservation confirmed
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          <div>
            <h1 className="serif text-5xl md:text-7xl xl:text-[5.75rem] leading-[0.92] max-w-2xl">
              Your seat is confirmed.
            </h1>
            <p className="mt-5 max-w-xl text-paper/70 text-sm md:text-base leading-6">
              Your payment has been processed and the reservation is locked in.
            </p>
          </div>

          {payment ? (
            <div className="rounded-[1.75rem] border border-paper/10 bg-black/35 p-6 md:p-8 backdrop-blur-sm">
              <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/45 mb-4">
                Payment reference
              </div>
              <div className="space-y-3 text-sm md:text-base text-paper/80">
                <div>
                  <span className="text-paper/45">Reservation ref:</span> {payment.reservationRef}
                </div>
                <div>
                  <span className="text-paper/45">Payment ID:</span> {payment.paymentId}
                </div>
                <div>
                  <span className="text-paper/45">Order ID:</span> {payment.orderId}
                </div>
                <div>
                  <span className="text-paper/45">Amount:</span> Rs{" "}
                  {payment.amount.toLocaleString()}
                </div>
                <div>
                  <span className="text-paper/45">Receipt:</span> {payment.receipt}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-paper px-5 py-3 text-ink transition-colors hover:bg-paper/90"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
