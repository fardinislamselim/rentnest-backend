// src/modules/payment/payment.validation.ts
import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  body: z.object({
    rentalRequestId: z
      .string().uuid("Invalid rentalRequestId"),
  }),
});

export const confirmPaymentSchema = z.object({
  body: z.object({
    paymentId: z
      .string().uuid("Invalid paymentId"),
    paymentMethodId: z.string().optional(),
  }),
});

export const getPaymentByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid payment id"),
  }),
});
