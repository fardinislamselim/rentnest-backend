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

router.post(
  "/create-intent",
  auth(Role.TENANT),
  validate(createPaymentIntentSchema),
  paymentController.createPaymentIntent,
);

router.post(
  "/confirm",
  auth(Role.TENANT),
  validate(confirmPaymentSchema),
  paymentController.confirmPayment,
);

router.get("/my-payments", auth(Role.TENANT), paymentController.getMyPayments);

router.get("/success", paymentController.paymentSuccessPage);
router.get("/cancel", paymentController.paymentCancelPage);

router.get(
  "/:id",
  auth(Role.TENANT),
  validate(getPaymentByIdSchema),
  paymentController.getPaymentById,
);

export const paymentRoutes = router;
