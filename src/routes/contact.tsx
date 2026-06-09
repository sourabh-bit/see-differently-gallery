import { createFileRoute } from "@tanstack/react-router";

import { InfoPageShell } from "@/components/InfoPageShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - See Differently" },
      {
        name: "description",
        content: "Contact details for the See Differently masterclass.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <InfoPageShell
      eyebrow="Contact"
      title="Contact"
      lead="Use the details below for booking help, access support, or class questions."
    >
      <div className="max-w-3xl space-y-5 text-sm leading-7 text-paper/75 md:text-base">
        <p>
          The best way to reach us is by email at{" "}
          <strong className="underline decoration-paper/40 underline-offset-4">
            hello@seen.studio
          </strong>
          . Please include your full name, the email used during booking, and a short description of
          the issue or question so we can understand your request quickly. Clear details help us
          respond faster and reduce back-and-forth.
        </p>
        <p>
          If your question is related to payment, reservation status, or access to the masterclass
          page, mention that directly in the message. That helps us route the request correctly and
          verify the booking information against our records. We aim to keep support simple, direct,
          and practical.
        </p>
        <p>
          You can also contact us by phone at{" "}
          <strong className="underline decoration-paper/40 underline-offset-4">
            +351 21 000 0000
          </strong>{" "}
          during working hours. Phone support is best for time-sensitive issues such as a payment
          concern, a mistaken booking detail, or last-minute access questions.
        </p>
        <p>
          We recommend using the contact page only for matters connected to the class, the booking
          flow, or the policies listed on this site. For anything unrelated, a short email is still
          welcome, but response times may vary depending on the current schedule and class activity.
        </p>
        <p>
          Support is handled with the goal of keeping the experience calm and premium. We do not ask
          for unnecessary information, and we only request the details needed to verify your
          reservation or answer your question properly. If we need anything else, we will ask
          clearly and directly.
        </p>
      </div>
    </InfoPageShell>
  );
}
