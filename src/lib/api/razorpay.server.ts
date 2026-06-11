import crypto from "node:crypto";
import process from "node:process";

import { assertRequiredEnv, createTimedFetch } from "@/lib/server-observability";

export type ReservationDraft = {
  name: string;
  email: string;
  whatsapp: string;
  notes?: string;
};

export type RazorpayOrderInput = ReservationDraft & {
  amount: number;
  currency: string;
  reservationRef?: string;
};

export type RazorpayOrderRecord = {
  id: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string | null;
  status: "created" | "attempted" | "paid";
};

export function getRazorpayConfig() {
  const env = assertRequiredEnv(
    "Razorpay",
    {
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
      RESERVATION_PRICE_INR_PAISA: process.env.RESERVATION_PRICE_INR_PAISA,
    },
    ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RESERVATION_PRICE_INR_PAISA"],
  );

  const merchantName = process.env.RAZORPAY_MERCHANT_NAME ?? "Seen/Differently";
  const currency = (process.env.RESERVATION_CURRENCY ?? "INR").toUpperCase();
  const amount = Number(env.RESERVATION_PRICE_INR_PAISA);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("RESERVATION_PRICE_INR_PAISA must be a positive number.");
  }

  console.info("[Razorpay] config ready", {
    hasKeyId: Boolean(env.RAZORPAY_KEY_ID),
    hasKeySecret: Boolean(env.RAZORPAY_KEY_SECRET),
    amountPaise: Math.round(amount),
    currency,
    merchantName,
  });

  return {
    keyId: env.RAZORPAY_KEY_ID,
    keySecret: env.RAZORPAY_KEY_SECRET,
    merchantName,
    amount: Math.round(amount),
    currency,
  };
}

function trimNotes(value: string) {
  return value.trim().slice(0, 256);
}

function buildReceipt() {
  return `seen-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

const RAZORPAY_REQUEST_TIMEOUT_MS = 10_000;
const razorpayFetch = createTimedFetch("Razorpay", RAZORPAY_REQUEST_TIMEOUT_MS);

async function readRazorpayOrderResponse(orderId: string) {
  const { keyId, keySecret } = getRazorpayConfig();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  console.info("[Razorpay] lookup start", { orderId, timeoutMs: RAZORPAY_REQUEST_TIMEOUT_MS });

  const response = await razorpayFetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Razorpay order lookup failed: ${text}`);
  }

  const order = JSON.parse(text) as Partial<RazorpayOrderRecord>;

  if (!order.id) {
    throw new Error("Razorpay did not return an order record.");
  }

  return order as RazorpayOrderRecord;
}

export async function createRazorpayOrder(input: RazorpayOrderInput) {
  const { keyId, keySecret } = getRazorpayConfig();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const receipt = input.reservationRef ? `seen-${input.reservationRef}` : buildReceipt();

  console.info("[Razorpay] order create start", {
    receipt,
    amount: input.amount,
    currency: input.currency,
    timeoutMs: RAZORPAY_REQUEST_TIMEOUT_MS,
  });

  const response = await razorpayFetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amount,
      currency: input.currency,
      receipt,
      notes: {
        student_name: trimNotes(input.name),
        student_email: trimNotes(input.email),
        student_whatsapp: trimNotes(input.whatsapp),
        student_notes: trimNotes(input.notes || "None"),
        ...(input.reservationRef ? { reservation_ref: trimNotes(input.reservationRef) } : {}),
      },
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Razorpay order creation failed: ${text}`);
  }

  const order = JSON.parse(text) as {
    id?: string;
    amount?: number;
    currency?: string;
    receipt?: string;
  };

  if (!order.id) {
    throw new Error("Razorpay did not return an order id.");
  }

  if (order.amount !== undefined && order.amount !== input.amount) {
    throw new Error("Razorpay returned an unexpected order amount.");
  }

  if (order.currency !== undefined && order.currency !== input.currency) {
    throw new Error("Razorpay returned an unexpected currency.");
  }

  return {
    orderId: order.id,
    amount: order.amount ?? input.amount,
    currency: order.currency ?? input.currency,
    receipt: order.receipt ?? receipt,
  };
}

export async function fetchRazorpayOrder(orderId: string) {
  return readRazorpayOrderResponse(orderId);
}

export async function refundRazorpayPayment(paymentId: string, amount?: number, reason?: string) {
  const { keyId, keySecret } = getRazorpayConfig();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  console.info("[Razorpay] refund start", {
    paymentId,
    amount,
    timeoutMs: RAZORPAY_REQUEST_TIMEOUT_MS,
  });

  const response = await razorpayFetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...(amount ? { amount } : {}),
      ...(reason ? { notes: { reason: trimNotes(reason) } } : {}),
    }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Razorpay refund failed: ${text}`);
  }

  const refund = JSON.parse(text) as { id?: string; status?: string };

  if (!refund.id) {
    throw new Error("Razorpay did not return a refund record.");
  }

  return refund;
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  keySecret: string,
) {
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const actualBuffer = Buffer.from(signature, "hex");

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
