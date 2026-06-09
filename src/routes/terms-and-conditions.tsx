import { createFileRoute } from "@tanstack/react-router";

import { InfoPageShell } from "@/components/InfoPageShell";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms - See Differently" },
      {
        name: "description",
        content: "Terms and conditions for the See Differently masterclass and booking flow.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <InfoPageShell
      eyebrow="Terms"
      title="Terms"
      lead="Please review the booking terms before completing payment."
    >
      <div className="max-w-3xl space-y-5 text-sm leading-7 text-paper/75 md:text-base">
        <p>
          By completing a reservation, you agree that the booking is for a specific masterclass seat
          and that payment must be completed through the checkout process provided on this website.
          A seat is considered confirmed only after the payment is successfully processed and
          verified. If payment does not complete, the booking is not final.
        </p>
        <p>
          You are responsible for providing accurate contact information during checkout. This
          includes your name, email address, and phone number or WhatsApp number, depending on what
          the booking flow requests. Incorrect details may prevent us from sending important class
          information or may delay confirmation of your reservation.
        </p>
        <p>
          The masterclass is a scheduled live session, and participation depends on the date, time,
          and access instructions communicated after booking. If you join late, miss the session, or
          are unable to attend because of personal circumstances, the reservation remains tied to
          the booked seat unless a separate approval is granted under the{" "}
          <strong className="underline decoration-paper/40 underline-offset-4">
            refund policy
          </strong>
          .
        </p>
        <p>
          All class content, methods, recordings, and supporting materials remain subject to our
          usage and distribution rules. Unless we explicitly say otherwise, you may not copy,
          redistribute, resell, or publicly repost class materials in a way that misrepresents the
          original session or gives others access without permission.
        </p>
        <p>
          We may update the website, payment flow, or supporting content from time to time to keep
          the booking process accurate and functional. If a change affects how reservations are
          handled, we will apply it in a way that is reasonable for current and future bookings.
          Continuing to use the site after a change means you accept the updated terms.
        </p>
        <p>
          Any misuse of the website, fraudulent payment attempts, false booking details, or abuse of
          the reservation system may result in a booking being cancelled or flagged for review. We
          reserve the right to refuse service where necessary to protect the class, the payment
          process, and the integrity of the booking system.
        </p>
        <p>
          If you have questions about these terms before paying, please contact us for clarification
          rather than guessing. We prefer to keep the process transparent so that every booking is
          made with a clear understanding of what is included and what is expected.
        </p>
      </div>
    </InfoPageShell>
  );
}
