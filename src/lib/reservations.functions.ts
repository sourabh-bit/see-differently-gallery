import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import QRCode from "qrcode";

const AMOUNT_RUPEES = 10000;
const UPI_ID = "8920145102@ptsbi";
const PAYEE_NAME = "Makeup Photography Masterclass";

function shortRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i += 1) s += chars[Math.floor(Math.random() * chars.length)];
  return `MPM-${s}`;
}

function buildUpiUri(ref: string) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: String(AMOUNT_RUPEES),
    cu: "INR",
    tn: `Masterclass ${ref}`,
  });
  return `upi://pay?${params.toString()}`;
}

const reservationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  whatsapp: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const createReservation = createServerFn({ method: "POST" })
  .validator(reservationSchema)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ref = shortRef();

    const { error } = await supabaseAdmin.from("reservations").insert({
      ref,
      name: data.name,
      email: data.email,
      phone: data.whatsapp,
      amount_paise: AMOUNT_RUPEES * 100,
      status: "pending",
      payment_note: data.notes ? data.notes : null,
    });

    if (error) throw new Error(error.message);
    return { ref };
  });

export const getReservation = createServerFn({ method: "POST" })
  .validator(z.object({ ref: z.string().min(4).max(40) }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("reservations")
      .select(
        "ref,name,email,phone,amount_paise,status,payment_note,claimed_paid_at,decided_at,created_at",
      )
      .eq("ref", data.ref)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) throw new Error("Reservation not found.");

    const upiUri = buildUpiUri(row.ref);
    const qrDataUrl = await QRCode.toDataURL(upiUri, { margin: 1, width: 360 });

    return {
      reservation: row,
      upiId: UPI_ID,
      payeeName: PAYEE_NAME,
      amountRupees: AMOUNT_RUPEES,
      upiUri,
      qrDataUrl,
    };
  });

export const claimReservationPaid = createServerFn({ method: "POST" })
  .validator(
    z.object({
      ref: z.string().min(4).max(40),
      note: z.string().trim().max(400).optional().or(z.literal("")),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("reservations")
      .update({
        claimed_paid_at: new Date().toISOString(),
        payment_note: data.note ? data.note : null,
      })
      .eq("ref", data.ref);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminList = createServerFn({ method: "POST" })
  .validator(
    z.object({
      passcode: z.string().min(1).max(200),
      filter: z.enum(["all", "pending", "approved", "rejected"]).default("all"),
    }),
  )
  .handler(async ({ data }) => {
    if (data.passcode !== process.env.ADMIN_PASSCODE) {
      throw new Error("Invalid passcode");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin
      .from("reservations")
      .select(
        "ref,name,email,phone,amount_paise,status,payment_note,claimed_paid_at,decided_at,created_at,updated_at",
      )
      .order("created_at", { ascending: false });

    if (data.filter !== "all") {
      query = query.eq("status", data.filter);
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const adminDecide = createServerFn({ method: "POST" })
  .validator(
    z.object({
      passcode: z.string().min(1).max(200),
      ref: z.string().min(4).max(40),
      decision: z.enum(["approved", "rejected"]),
    }),
  )
  .handler(async ({ data }) => {
    if (data.passcode !== process.env.ADMIN_PASSCODE) {
      throw new Error("Invalid passcode");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("reservations")
      .update({
        status: data.decision,
        decided_at: new Date().toISOString(),
      })
      .eq("ref", data.ref);

    if (error) throw new Error(error.message);
    return { ok: true };
  });
