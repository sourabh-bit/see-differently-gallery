import { createFileRoute } from "@tanstack/react-router";

import { InfoPageShell } from "@/components/InfoPageShell";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing - See Differently" },
      {
        name: "description",
        content: "Pricing details for the See Differently mobile photography masterclass.",
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <InfoPageShell
      eyebrow="Pricing"
      title="Pricing"
      lead="A single reservation covers the live session and the replay access mentioned below."
    >
      <div className="max-w-3xl space-y-5 text-sm leading-7 text-paper/75 md:text-base">
        <p>
          The masterclass is priced at{" "}
          <strong className="underline decoration-paper/40 underline-offset-4">Rs 10,000</strong>{" "}
          for a single seat. This amount is the full reservation fee and there are no hidden tiers,
          surprise add-ons, or separate access charges added later in the process. We keep the
          structure straightforward so the booking experience stays easy to understand.
        </p>
        <p>
          The fee covers admission to the live class, the seat reservation itself, and replay access
          after the event if provided for that edition. The purpose of this structure is to make the
          offering feel complete rather than fragmented into multiple upsells. When a participant
          completes payment, the booking is treated as a{" "}
          <strong className="underline decoration-paper/40 underline-offset-4">
            confirmed seat
          </strong>{" "}
          for that session.
        </p>
        <p>
          We process payments in INR through Razorpay. That means the final checkout experience
          follows Razorpay&apos;s secure payment flow, including the available methods supported by
          the gateway. The site verifies the successful payment response before it moves the booking
          forward, so the payment and reservation states stay aligned.
        </p>
        <p>
          If a participant needs help understanding the price before paying, the contact page is
          available for questions. The intention is not to make the checkout feel urgent or unclear.
          Instead, the pricing page exists so that the reservation amount is visible, plain, and
          easy to review before any money is charged.
        </p>
        <p>
          Because the class is limited and personal in format, each seat carries a fixed value. That
          helps protect the quality of the session and keeps the class size manageable. The
          reservation price also helps us maintain the editorial quality of the experience,
          including preparation, delivery, and follow-up support where applicable.
        </p>
        <p>
          Any future changes in pricing, if they are ever introduced, would be communicated before
          checkout so there is no ambiguity. For the current edition, the pricing remains simple:
          one seat, one price, one secure payment path.
        </p>
      </div>
    </InfoPageShell>
  );
}
