import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  createRazorpayOrder,
  fetchRazorpayOrder,
  getRazorpayConfig,
  verifyRazorpaySignature,
} from "./razorpay.server";

const reservationInput = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  whatsapp: z.string().min(6).max(40),
  notes: z.string().max(500).optional().or(z.literal("")),
  reservationRef: z.string().min(4).max(40).optional(),
});

type ReservationCheckoutResponse = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
  merchantName: string;
};

export const createReservationCheckout = createServerFn({ method: "POST" })
  .inputValidator(reservationInput)
  .handler(async ({ data }): Promise<ReservationCheckoutResponse> => {
    const config = getRazorpayConfig();
    const order = await createRazorpayOrder({
      ...data,
      notes: data.notes ?? "",
      amount: config.amount,
      currency: config.currency,
    });

    return {
      keyId: config.keyId,
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      merchantName: config.merchantName,
    };
  });

const verifyReservationInput = z.object({
  orderId: z.string().min(5),
  paymentId: z.string().min(5),
  signature: z.string().min(10),
});

type VerifyReservationPaymentResponse = {
  verified: true;
  orderStatus: "paid";
  amount: number;
  currency: string;
  receipt: string | null;
};

export const verifyReservationPayment = createServerFn({ method: "POST" })
  .inputValidator(verifyReservationInput)
  .handler(async ({ data }): Promise<VerifyReservationPaymentResponse> => {
    const { keySecret, amount: expectedAmount, currency: expectedCurrency } = getRazorpayConfig();
    const verified = verifyRazorpaySignature(
      data.orderId,
      data.paymentId,
      data.signature,
      keySecret,
    );

    if (!verified) {
      throw new Error("Payment signature verification failed.");
    }

    const order = await fetchRazorpayOrder(data.orderId);

    if (order.status !== "paid") {
      throw new Error("Payment was signed correctly, but the order is not marked as paid yet.");
    }

    if (order.amount !== expectedAmount) {
      throw new Error("Payment amount does not match the workshop price.");
    }

    if (order.currency !== expectedCurrency) {
      throw new Error("Payment currency does not match the configured workshop currency.");
    }

    if (order.amount_due !== 0 || order.amount_paid !== order.amount) {
      throw new Error("Payment has not been fully settled yet.");
    }

    return {
      verified: true,
      orderStatus: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  });
