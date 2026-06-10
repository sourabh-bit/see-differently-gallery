import { createFileRoute } from "@tanstack/react-router";

import { InfoPageShell } from "@/components/InfoPageShell";

export const Route = createFileRoute("/refund-cancellation-policy")({
  head: () => ({
    meta: [
      { title: "Refunds - See Differently" },
      {
        name: "description",
        content: "Refund and cancellation policy for the See Differently masterclass bookings.",
      },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <InfoPageShell
      eyebrow="Refunds"
      title="Refund policy"
      lead="If your plans change, contact us as soon as possible so we can review your request."
    >
      <div className="max-w-3xl space-y-5 text-sm leading-7 text-paper/75 md:text-base">
        <p>
          Refunds and cancellations are reviewed based on the timing of the request and the stage of
          the booking. If you contact us before the live class starts, we will review your case and
          process the request where appropriate under the circumstances. We encourage you to reach
          out early if you think you may need to change your plans.
        </p>
        <p>
          Once the live session has begun, refunds are generally not available because the seat has
          already been reserved for you and the experience has effectively started. This is
          especially important for limited-seat sessions, where each place is allocated in advance
          and cannot easily be reassigned after the session is underway.
        </p>
        <p>
          If a refund is issued, it will typically be returned through the original payment method
          used at checkout, subject to the processing times of the payment provider and the banking
          network. We do not control the exact speed of the return once the refund has been
          initiated, so some delay may occur before the funds appear in your account.
        </p>
        <p>
          We may ask for the booking name, email address, payment reference, and a short reason for
          the cancellation request so that we can locate your reservation and review it properly.
          Providing complete information helps speed up the process and avoids unnecessary delay or
          confusion.
        </p>
        <p>
          If the booking details are incorrect or if a duplicate payment has occurred, contact us as
          soon as possible so we can examine the issue. In some cases, a cancellation may be handled
          differently from a standard refund request if the problem relates to a duplicate charge, a
          verification issue, or a technical fault in the checkout process.
        </p>
        <p>
          We reserve the right to assess refund and cancellation requests case by case, especially
          where the circumstances are unusual or involve late notice. Our goal is to be fair while
          also protecting the integrity of the limited-seat masterclass and the operational costs
          required to run it.
        </p>
        <p>
          For the smoothest support experience, please include your reservation details and contact
          us through the address listed on the contact page. The clearer your message, the faster we
          can review the request and tell you what is possible under the current policy.
        </p>
      </div>
    </InfoPageShell>
  );
}
