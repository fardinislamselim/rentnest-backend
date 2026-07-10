import { Router } from "express";

import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { validate } from "../../middlewares/validate";
import {
  createPaymentIntentSchema,
  confirmPaymentSchema,
  getPaymentByIdSchema,
} from "./payment.validation";
import { paymentController } from "./payment.controller";


const router = Router();

/**
 * @swagger
 * /payments/create-intent:
 *   post:
 *     summary: Create payment intent
 *     description: Create a Stripe payment intent for an approved rental request.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rentalRequestId
 *             properties:
 *               rentalRequestId:
 *                 type: string
 *                 format: uuid
 *                 example: 1e339df4-8f5c-40ee-a893-242d8ae049dd
 *     responses:
 *       201:
 *         description: Payment intent created successfully.
 *       400:
 *         description: Invalid rental request or request is not approved.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Tenant access required.
 *       404:
 *         description: Rental request not found.
 */
router.post(
  "/create-intent",
  auth(Role.TENANT),
  validate(createPaymentIntentSchema),
  paymentController.createPaymentIntent,
);

/**
 * @swagger
 * /payments/confirm:
 *   post:
 *     summary: Confirm payment
 *     description: Verify a completed Stripe payment and update payment, rental request, and property status.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *             properties:
 *               paymentId:
 *                 type: string
 *                 example: pi_3Qxxxxxxxxxxxxxxxx
 *     responses:
 *       200:
 *         description: Payment confirmed successfully.
 *       400:
 *         description: Payment verification failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Payment not found.
 */
router.post(
  "/confirm",
  auth(Role.TENANT),
  validate(confirmPaymentSchema),
  paymentController.confirmPayment,
);

/**
 * @swagger
 * /payments/my-payments:
 *   get:
 *     summary: Get my payments
 *     description: Retrieve all payments made by the authenticated tenant.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Tenant access required.
 */
router.get("/my-payments", auth(Role.TENANT), paymentController.getMyPayments);

/**
 * @swagger
 * /payments/success:
 *   get:
 *     summary: Payment success page
 *     description: Display the payment success page after a successful Stripe checkout.
 *     tags:
 *       - Payments
 *     security: []
 *     responses:
 *       200:
 *         description: Payment success page displayed successfully.
 */
router.get("/success", paymentController.paymentSuccessPage);
/**
 * @swagger
 * /payments/cancel:
 *   get:
 *     summary: Payment cancelled page
 *     description: Display the payment cancelled page when the payment process is cancelled.
 *     tags:
 *       - Payments
 *     security: []
 *     responses:
 *       200:
 *         description: Payment cancelled page displayed successfully.
 */
router.get("/cancel", paymentController.paymentCancelPage);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get payment details
 *     description: Retrieve detailed information about a specific payment.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payment ID
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 3cecc2f2-9494-44df-addf-b35c6728e4c2
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully.
 *       400:
 *         description: Invalid payment ID.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Tenant access required.
 *       404:
 *         description: Payment not found.
 */
router.get(
  "/:id",
  auth(Role.TENANT),
  validate(getPaymentByIdSchema),
  paymentController.getPaymentById,
);

export const paymentRoutes = router;
