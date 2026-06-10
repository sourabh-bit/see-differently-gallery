import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { createReservation, markReservationPaid } from "@/lib/reservations.functions";
import {
  createReservationCheckout,
  verifyReservationPayment,
} from "@/lib/api/reservation.functions";
import { useServerFn } from "@tanstack/react-start";

type ReservationDraft = {
  name: string;
  email: string;
  whatsapp: string;
  notes: string;
};

const WORKSHOP_PRICE = 10000;
const CHECKOUT_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const RESERVE_FORM_URL = "/#reserve";
const REDIRECT_DELAY_MS = 1200;

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpaySummary = {
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  receipt: string;
  reservationRef: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  handler: (response: RazorpaySuccess) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void };
  }
}

function safeGetSessionItem(key: string) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetSessionItem(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Ignore browser storage restrictions.
  }
}

function safeRemoveSessionItem(key: string) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignore browser storage restrictions.
  }
}

export const Route = createFileRoute("/reserve/payment")({
  component: PaymentPage,
});

function loadRazorpayCheckoutScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CHECKOUT_SCRIPT_SRC}"]`,
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Unable to load Razorpay Checkout.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
    document.body.appendChild(script);
  });
}

function PaymentPage() {
  const createCheckout = useServerFn(createReservationCheckout);
  const markPaid = useServerFn(markReservationPaid);
  const createReservationFn = useServerFn(createReservation);
  const [draft, setDraft] = useState<ReservationDraft | null>(null);
  const [reservationRef, setReservationRef] = useState<string | null>(null);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const raw = safeGetSessionItem("seen-reservation-draft");
    const ref = safeGetSessionItem("seen-reservation-ref");

    if (ref) {
      setReservationRef(ref);
    }

    if (!raw) {
      setHasLoadedDraft(true);
      return;
    }

    try {
      setDraft(JSON.parse(raw) as ReservationDraft);
    } catch {
      setErrorMessage("Could not read the reservation details. Please go back and submit again.");
    }
    setHasLoadedDraft(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedDraft || draft) return;

    const timer = window.setTimeout(() => {
      window.location.replace(RESERVE_FORM_URL);
    }, REDIRECT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [draft, hasLoadedDraft]);

  const startCheckout = async () => {
    if (isProcessing) {
      return;
    }

    if (!draft) {
      setErrorMessage("No reservation details were found. Please submit the form again.");
      return;
    }

    let ref = reservationRef ?? safeGetSessionItem("seen-reservation-ref");

    setErrorMessage("");
    setIsProcessing(true);

    try {
      if (!ref) {
        const reservation = await createReservationFn({ data: draft });
        ref = reservation.ref;
        safeSetSessionItem("seen-reservation-ref", ref);
      }

      const checkout = await createCheckout({
        data: {
          ...draft,
          reservationRef: ref,
        },
      });

      await loadRazorpayCheckoutScript();

      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout is unavailable in this browser.");
      }

      const payment = new window.Razorpay({
        key: checkout.keyId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: checkout.merchantName,
        description: "Seen/Differently masterclass reservation",
        order_id: checkout.orderId,
        prefill: {
          name: draft.name,
          email: draft.email,
          contact: draft.whatsapp,
        },
        notes: {
          student_name: draft.name,
          student_email: draft.email,
          student_whatsapp: draft.whatsapp,
          student_notes: draft.notes || "None",
          reservation_ref: ref,
          receipt: checkout.receipt,
        },
        theme: {
          color: "#111111",
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
        handler: async (response) => {
          try {
            const verification = await verifyReservationPayment({
              data: {
                orderId: checkout.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            });

            await markPaid({
              data: {
                ref,
                orderId: checkout.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            });

            const paymentSummary: RazorpaySummary = {
              orderId: checkout.orderId,
              paymentId: response.razorpay_payment_id,
              amount: verification.amount,
              currency: verification.currency,
              receipt: verification.receipt ?? checkout.receipt,
              reservationRef: ref,
            };

            safeSetSessionItem("seen-razorpay-payment", JSON.stringify(paymentSummary));
            safeRemoveSessionItem("seen-reservation-draft");
            safeRemoveSessionItem("seen-reservation-ref");
            window.location.replace("/reserve/complete");
          } catch (verificationError) {
            setErrorMessage(
              verificationError instanceof Error
                ? verificationError.message
                : "Payment was received, but verification failed.",
            );
            setIsProcessing(false);
          }
        },
      });

      payment.open();
    } catch (checkoutError) {
      setErrorMessage(
        checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.",
      );
      setIsProcessing(false);
    }
  };

  if (!hasLoadedDraft) {
    return (
      <main className="min-h-screen bg-ink text-paper px-6 md:px-12 py-24 md:py-32">
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
        <div className="relative mx-auto max-w-3xl">
          <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-paper/55 mb-6">
            Razorpay checkout
          </div>
          <h1 className="serif text-5xl md:text-7xl leading-none">Preparing your reservation.</h1>
          <p className="mt-6 max-w-xl text-paper/70 text-base md:text-lg leading-7">
            We are loading the reservation slip before opening Razorpay.
          </p>
        </div>
      </main>
    );
  }

  if (!draft) {
    return (
      <main className="min-h-screen bg-ink text-paper px-6 md:px-12 py-24 md:py-32">
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
        <div className="relative mx-auto max-w-3xl">
          <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-paper/55 mb-6">
            Razorpay checkout
          </div>
          <h1 className="serif text-5xl md:text-7xl leading-none">Sending you back to reserve.</h1>
          <p className="mt-6 max-w-xl text-paper/70 text-base md:text-lg leading-7">
            We could not restore your reservation slip, so we are returning you to the form.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-paper px-6 md:px-12 py-20 md:py-28">
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
        <div className="mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-paper/55 mb-6 md:mb-8">
          Razorpay checkout
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          <div className="space-y-8">
            <div>
              <h1 className="serif text-5xl md:text-7xl xl:text-[5.75rem] leading-[0.92] max-w-2xl">
                Complete your reservation <span className="italic">Rs 10,000</span>.
              </h1>
              <p className="mt-5 max-w-xl text-paper/70 text-sm md:text-base leading-6">
                Your seat is held under {draft.name}. One secure payment, then we move straight to
                confirmation.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-paper/10 bg-white/5 px-5 py-4 text-center backdrop-blur-sm">
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/45">
                  Seat held
                </div>
                <div className="mt-2 serif text-2xl leading-none">{draft.name}</div>
              </div>
              <div className="rounded-2xl border border-paper/10 bg-white/5 px-5 py-4 text-center backdrop-blur-sm">
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/45">
                  Payment
                </div>
                <div className="mt-2 serif text-2xl leading-none">
                  Rs {WORKSHOP_PRICE.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-paper/10 bg-white/5 p-6 md:p-8 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-4">
                <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/55">
                  Payment action
                </div>
                <div className="h-2 w-2 rounded-full bg-paper/70" />
              </div>
              <button
                type="button"
                onClick={startCheckout}
                disabled={isProcessing}
                className="mx-auto mt-5 inline-flex min-w-[220px] items-center justify-center rounded-full bg-paper px-6 py-3.5 text-sm md:text-base font-medium text-ink transition-all hover:bg-paper/90 disabled:cursor-wait disabled:opacity-70"
              >
                {isProcessing ? "Opening Razorpay..." : "Pay securely with Razorpay"}
              </button>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-paper/10 bg-black/35 p-6 md:p-8 text-center backdrop-blur-sm">
            <div className="mono text-[10px] tracking-[0.3em] uppercase text-paper/45 mb-4">
              Reservation slip
            </div>
            <div className="flex flex-col items-center gap-4">
              <div>
                <div className="serif text-4xl md:text-6xl leading-[0.92]">{draft.name}</div>
                <p className="mt-4 text-paper/70 text-sm md:text-base leading-6">
                  {draft.email}
                  <br />
                  {draft.whatsapp}
                </p>
              </div>
              <div className="h-3 w-3 rounded-full bg-paper/85 shadow-[0_0_0_12px_rgba(255,255,255,0.05)]" />
            </div>
            {draft.notes ? (
              <p className="mx-auto mt-6 max-w-md border-t border-paper/10 pt-5 text-paper/60 text-sm leading-6">
                {draft.notes}
              </p>
            ) : null}
          </div>
        </div>

        {errorMessage ? (
          <p className="relative mt-6 text-sm text-red-300/90">{errorMessage}</p>
        ) : null}
      </div>
    </main>
  );
}
