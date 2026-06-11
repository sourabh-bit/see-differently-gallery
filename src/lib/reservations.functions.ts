import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { refundRazorpayPayment } from "@/lib/api/razorpay.server";
import { serializeError } from "@/lib/server-observability";

const AMOUNT_RUPEES = 10000;

function shortRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i += 1) s += chars[Math.floor(Math.random() * chars.length)];
  return `MPM-${s}`;
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
    console.info("[createReservation] start", {
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      amountPaise: AMOUNT_RUPEES * 100,
    });

    try {
      console.info("[createReservation] importing supabase client");
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      console.info("[createReservation] supabase client imported");

      const ref = shortRef();
      console.info("[createReservation] before insert", {
        ref,
        paymentStatus: "pending",
      });

      const { error } = await supabaseAdmin.from("reservations").insert({
        ref,
        name: data.name,
        email: data.email,
        phone: data.whatsapp,
        notes: data.notes ?? null,
        amount_paise: AMOUNT_RUPEES * 100,
        payment_status: "pending",
      });

      console.info("[createReservation] after insert", {
        ref,
        hasError: Boolean(error),
      });

      if (error) {
        console.error("[createReservation] insert error", {
          ref,
          error: serializeError(error),
        });
        throw new Error(error.message);
      }

      console.info("[createReservation] complete", { ref });
      return { ref };
    } catch (error) {
      console.error("[createReservation] failed", serializeError(error));
      throw error;
    }
  });

export const markReservationPaid = createServerFn({ method: "POST" })
  .validator(
    z.object({
      ref: z.string().min(4).max(40),
      orderId: z.string().min(5),
      paymentId: z.string().min(5),
      signature: z.string().min(10),
    }),
  )
  .handler(async ({ data }) => {
    console.info("[markReservationPaid] start", { ref: data.ref });

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      console.info("[markReservationPaid] before update", { ref: data.ref });

      const { error } = await supabaseAdmin
        .from("reservations")
        .update({
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          payment_order_id: data.orderId,
          payment_id: data.paymentId,
          payment_signature: data.signature,
          refunded_at: null,
          refund_reason: null,
        })
        .eq("ref", data.ref);

      console.info("[markReservationPaid] after update", {
        ref: data.ref,
        hasError: Boolean(error),
      });

      if (error) throw new Error(error.message);
      console.info("[markReservationPaid] complete", { ref: data.ref });
      return { ok: true };
    } catch (error) {
      console.error("[markReservationPaid] failed", serializeError(error));
      throw error;
    }
  });

export const adminList = createServerFn({ method: "POST" })
  .validator(
    z.object({
      passcode: z.string().min(1).max(200),
      filter: z.enum(["all", "pending", "paid", "refunded"]).default("all"),
    }),
  )
  .handler(async ({ data }) => {
    console.info("[adminList] start", { filter: data.filter });

    if (data.passcode !== process.env.ADMIN_PASSCODE) {
      throw new Error("Invalid passcode");
    }

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      let query = supabaseAdmin
        .from("reservations")
        .select(
          "ref,name,email,phone,notes,amount_paise,payment_status,paid_at,payment_order_id,payment_id,refunded_at,refund_reason,created_at,updated_at",
        )
        .order("created_at", { ascending: false });

      if (data.filter !== "all") {
        query = query.eq("payment_status", data.filter);
      }

      console.info("[adminList] before query", { filter: data.filter });
      const { data: rows, error } = await query;
      console.info("[adminList] after query", {
        filter: data.filter,
        rowCount: rows?.length ?? 0,
        hasError: Boolean(error),
      });

      if (error) throw new Error(error.message);
      return { rows: rows ?? [] };
    } catch (error) {
      console.error("[adminList] failed", serializeError(error));
      throw error;
    }
  });

export const adminRefund = createServerFn({ method: "POST" })
  .validator(
    z.object({
      passcode: z.string().min(1).max(200),
      ref: z.string().min(4).max(40),
      reason: z.string().trim().max(400).optional(),
    }),
  )
  .handler(async ({ data }) => {
    console.info("[adminRefund] start", { ref: data.ref });

    if (data.passcode !== process.env.ADMIN_PASSCODE) {
      throw new Error("Invalid passcode");
    }

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      console.info("[adminRefund] before lookup", { ref: data.ref });
      const { data: row, error: rowError } = await supabaseAdmin
        .from("reservations")
        .select("payment_id,amount_paise,payment_status")
        .eq("ref", data.ref)
        .maybeSingle();

      console.info("[adminRefund] after lookup", {
        ref: data.ref,
        hasRow: Boolean(row),
        hasError: Boolean(rowError),
      });

      if (rowError) throw new Error(rowError.message);
      if (!row) throw new Error("Reservation not found.");
      if (!row.payment_id) throw new Error("No payment ID exists for this reservation.");
      if (row.payment_status === "refunded") {
        return { ok: true };
      }

      console.info("[adminRefund] before razorpay refund", {
        ref: data.ref,
        paymentId: row.payment_id,
      });
      await refundRazorpayPayment(row.payment_id, row.amount_paise, data.reason);
      console.info("[adminRefund] after razorpay refund", {
        ref: data.ref,
        paymentId: row.payment_id,
      });

      const { error } = await supabaseAdmin
        .from("reservations")
        .update({
          payment_status: "refunded",
          refunded_at: new Date().toISOString(),
          refund_reason: data.reason ?? null,
        })
        .eq("ref", data.ref);

      console.info("[adminRefund] after update", {
        ref: data.ref,
        hasError: Boolean(error),
      });

      if (error) throw new Error(error.message);
      return { ok: true };
    } catch (error) {
      console.error("[adminRefund] failed", serializeError(error));
      throw error;
    }
  });
