import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const UPI_ID = "8920145102@ptsbi";
const PAYEE_NAME = "Makeup Photography Masterclass";
const AMOUNT_RUPEES = 10000;

function shortRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `MPM-${s}`;
}

const CreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(20).regex(/^[0-9+\-\s()]+$/),
});

export const createReservation = createServerFn({ method: "POST" })
  .inputValidator((d) => CreateSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ref = shortRef();
    const { error } = await supabaseAdmin.from("reservations").insert({
      ref,
      name: data.name,
      email: data.email,
      phone: data.phone,
      amount_paise: AMOUNT_RUPEES * 100,
      status: "pending",
    });
    if (error) throw new Error(error.message);
    return { ref };
  });

export const getReservation = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ ref: z.string().min(4).max(40) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("reservations")
      .select("ref,name,email,phone,amount_paise,status,claimed_paid_at,created_at")
      .eq("ref", data.ref)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    const QRCode = (await import("qrcode")).default;
    const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${AMOUNT_RUPEES}&cu=INR&tn=${encodeURIComponent(row.ref)}`;
    const qrDataUrl = await QRCode.toDataURL(upiUrl, { margin: 1, width: 360 });
    return { ...row, upi_id: UPI_ID, payee_name: PAYEE_NAME, upi_url: upiUrl, qr_data_url: qrDataUrl };
  });

export const markPaid = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      ref: z.string().min(4).max(40),
      note: z.string().trim().max(400).optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("reservations")
      .update({ claimed_paid_at: new Date().toISOString(), payment_note: data.note ?? null })
      .eq("ref", data.ref)
      .eq("status", "pending");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminList = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      passcode: z.string().min(1).max(200),
      filter: z.enum(["all", "pending", "approved", "rejected", "claimed"]).default("all"),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    if (data.passcode !== process.env.ADMIN_PASSCODE) {
      throw new Error("Invalid passcode");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("reservations")
      .select("ref,name,email,phone,amount_paise,status,claimed_paid_at,payment_note,decided_at,created_at")
      .order("created_at", { ascending: false });
    if (data.filter === "claimed") q = q.eq("status", "pending").not("claimed_paid_at", "is", null);
    else if (data.filter !== "all") q = q.eq("status", data.filter);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const adminDecide = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      passcode: z.string().min(1).max(200),
      ref: z.string().min(4).max(40),
      decision: z.enum(["approved", "rejected"]),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    if (data.passcode !== process.env.ADMIN_PASSCODE) {
      throw new Error("Invalid passcode");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("reservations")
      .update({ status: data.decision, decided_at: new Date().toISOString() })
      .eq("ref", data.ref);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
