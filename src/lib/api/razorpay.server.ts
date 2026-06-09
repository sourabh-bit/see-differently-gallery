import crypto from "node:crypto";
import process from "node:process";

export type ReservationDraft = {
  name: string;
  email: string;
  whatsapp: string;
  notes?: string;
};

export type RazorpayOrderInput = ReservationDraft & {
  amount: number;
  currency: string;
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
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const merchantName = process.env.RAZORPAY_MERCHANT_NAME ?? "Seen/Differently";
  const amountRaw = process.env.RESERVATION_PRICE_INR_PAISA ?? "1000000";
  const currency = (process.env.RESERVATION_CURRENCY ?? "INR").toUpperCase();

  if (!keyId) {
    throw new Error("Missing RAZORPAY_KEY_ID. Add it to enable checkout.");
  }

  if (!keySecret) {
    throw new Error("Missing RAZORPAY_KEY_SECRET. Add it to verify payments.");
  }

  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      "Missing RESERVATION_PRICE_INR_PAISA. Set the workshop price before taking payments.",
    );
  }

  return {
    keyId,
    keySecret,
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

async function readRazorpayOrderResponse(orderId: string) {
  const { keyId, keySecret } = getRazorpayConfig();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const response = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
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
  const receipt = buildReceipt();

  const response = await fetch("https://api.razorpay.com/v1/orders", {
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
