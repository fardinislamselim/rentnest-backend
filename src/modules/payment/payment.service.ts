import httpStatus from "http-status";

import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import AppError from "../../errors/AppError";
import {
  ICreatePaymentIntentPayload,
  ICreatePaymentIntentResult,
  IConfirmPaymentPayload,
} from "./payment.interface";


const toSmallestUnit = (amount: number) => Math.round(amount * 100);

const createPaymentIntent = async (
  tenantId: string,
  payload: ICreatePaymentIntentPayload,
): Promise<ICreatePaymentIntentResult> => {
  const { rentalRequestId } = payload;

  return prisma.$transaction(async (tx) => {
    const rentalRequest = await tx.rentalRequest.findUnique({
      where: { id: rentalRequestId },
      include: { property: true, tenant: true, payment: true },
    });

    if (!rentalRequest) {
      throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
    }

    if (rentalRequest.tenantId !== tenantId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not allowed to pay for this rental request",
      );
    }

    if (rentalRequest.status !== "APPROVED") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Payment is only allowed for approved rentals. Current status: ${rentalRequest.status}`,
      );
    }

    if (rentalRequest.payment) {
      if (rentalRequest.payment.status === "COMPLETED") {
        throw new AppError(
          httpStatus.CONFLICT,
          "This rental request has already been paid for",
        );
      }

      const existingSession = await stripe.checkout.sessions.retrieve(
        rentalRequest.payment.transactionId as string,
      );

      if (existingSession.status === "open" && existingSession.url) {
        return {
          paymentId: rentalRequest.payment.id,
          checkoutUrl: existingSession.url,
          sessionId: existingSession.id,
          amount: rentalRequest.payment.amount,
          currency: config.stripe_currency,
        };
      }
    }

    const amount = rentalRequest.property.price;

    const payment = rentalRequest.payment
      ? await tx.payment.update({
          where: { id: rentalRequest.payment.id },
          data: { transactionId: "", status: "PENDING" },
        })
      : await tx.payment.create({
          data: {
            rentalRequestId: rentalRequest.id,
            amount,
            provider: "STRIPE",
            transactionId: "",
            status: "PENDING",
          },
        });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: rentalRequest.tenant.email,
      line_items: [
        {
          price_data: {
            currency: config.stripe_currency,
            unit_amount: toSmallestUnit(amount),
            product_data: {
              name: rentalRequest.property.title,
              description: `Rental payment for ${rentalRequest.property.location}`,
            },
          },
          quantity: 1,
        },
      ],

      success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}&payment_id=${payment.id}`,
      cancel_url: `${config.app_url}/payment/cancel`,
      metadata: {
        rentalRequestId: rentalRequest.id,
        tenantId,
        propertyId: rentalRequest.propertyId,
      },
    });

    await tx.payment.update({
      where: { id: payment.id },
      data: { transactionId: session.id },
    });

    return {
      paymentId: payment.id,
      checkoutUrl: session.url as string,
      sessionId: session.id,
      amount,
      currency: config.stripe_currency,
    };
  });
};

const confirmPayment = async (
  tenantId: string,
  payload: IConfirmPaymentPayload,
) => {
  const { paymentId } = payload;

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { rentalRequest: true },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.rentalRequest.tenantId !== tenantId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to confirm this payment");
  }

  if (payment.status === "COMPLETED") {
    throw new AppError(httpStatus.CONFLICT, "This payment has already been confirmed");
  }

  const session = await stripe.checkout.sessions.retrieve(
    payment.transactionId as string,
  );

  if (session.payment_status !== "paid") {
    if (session.status === "expired") {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: "FAILED" },
      });
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Payment session expired. Please start a new payment.",
      );
    }
    throw new AppError(
      400,
      `Payment is not completed yet. Stripe status: ${session.payment_status}`,
    );
  }

  // 2) Success — atomically update Payment, RentalRequest, and Property
  return prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: { status: "COMPLETED", paidAt: new Date() },
    });

    const updatedRental = await tx.rentalRequest.update({
      where: { id: payment.rentalRequestId },
      data: { status: "ACTIVE" },
    });

    await tx.property.update({
      where: { id: updatedRental.propertyId },
      data: { status: "RENTED" },
    });

    return updatedPayment;
  });
};

const getMyPayments = async (tenantId: string) => {
  return prisma.payment.findMany({
    where: { rentalRequest: { tenantId } },
    include: {
      rentalRequest: {
        include: { property: { select: { title: true, location: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getPaymentById = async (tenantId: string, paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: { property: { select: { title: true, location: true } } },
      },
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.rentalRequest.tenantId !== tenantId) {
    throw new AppError(403, "You are not allowed to view this payment");
  }

  return payment;
};

export const paymentService = {
  createPaymentIntent,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
