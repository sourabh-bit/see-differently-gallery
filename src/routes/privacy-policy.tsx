import { createFileRoute } from "@tanstack/react-router";

import { InfoPageShell } from "@/components/InfoPageShell";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy - See Differently" },
      {
        name: "description",
        content: "Privacy policy for the See Differently masterclass website and checkout flow.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <InfoPageShell
      eyebrow="Privacy policy"
      title="Privacy policy"
      lead="We collect only the information needed to manage reservations and support."
    >
      <div className="max-w-3xl space-y-5 text-sm leading-7 text-paper/75 md:text-base">
        <p>
          We collect information that is necessary to process a reservation for the masterclass and
          to keep your booking details accurate. This may include your name, email address, WhatsApp
          number, payment reference, and any note you submit during the booking process. We do not
          ask for information that is unrelated to the class or the reservation.
        </p>
        <p>
          The reason we collect this information is straightforward. We use it to confirm your seat,
          send booking-related updates, verify successful payment, and support you if there is a
          problem with access or class communication. The information helps us connect your booking
          to the correct reservation record.
        </p>
        <p>
          Payment processing is handled by{" "}
          <strong className="underline decoration-paper/40 underline-offset-4">Razorpay</strong>.
          The checkout flow may pass information to the payment gateway as required to complete the
          transaction securely. We do not store your card number, CVV, or bank credentials on our
          server.
        </p>
        <p>
          We may also use reservation data internally to prevent duplicate bookings, resolve
          disputes, complete order verification, or respond to customer support requests. When we
          contact you, it will generally be for class-related matters such as confirmation, schedule
          updates, or clarification about your reservation.
        </p>
        <p>
          We retain reservation and communication records only for as long as needed to manage the
          booking, comply with legal or accounting obligations, and support legitimate service
          needs. If data is no longer needed for those purposes, it may be deleted or anonymized in
          line with our internal retention practices.
        </p>
        <p>
          We do not sell personal data. We also do not use your details for unrelated marketing in a
          way that is inconsistent with the reason you provided them. If third-party tools are used
          for hosting, analytics, or payments, they are used only to support the operation of the
          website and the reservation flow.
        </p>
        <p>
          If you want to ask about the information we hold about you, or if you believe something
          should be corrected, you can contact us using the details on the contact page. We will
          review reasonable requests and respond where appropriate according to the situation and
          any applicable legal requirements.
        </p>
      </div>
    </InfoPageShell>
  );
}
