import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { rentalController } from "./rental.controller";
import {
  createRentalValidationSchema,
  rentalIdValidationSchema,
} from "./rental.validation";

const router = Router();

router.post(
  "/",
  auth(Role.TENANT),
  validate(createRentalValidationSchema),
  rentalController.createRentalRequest,
);

router.get(
  "/my-rentals",
  auth(Role.TENANT),
  rentalController.getMyRentalRequests,
);

router.get(
  "/requests",
  auth(Role.LANDLORD),
  rentalController.getLandlordRentalRequests,
);

router.get("/history", auth(Role.LANDLORD), rentalController.getRentalHistory);

router.get(
  "/:id",
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  validate(rentalIdValidationSchema),
  rentalController.getSingleRentalRequest,
);

router.patch(
  "/:id/cancel",
  auth(Role.TENANT),
  validate(rentalIdValidationSchema),
  rentalController.cancelRentalRequest,
);

router.patch(
  "/:id/approve",
  auth(Role.LANDLORD),
  validate(rentalIdValidationSchema),
  rentalController.approveRentalRequest,
);

router.patch(
  "/:id/reject",
  auth(Role.LANDLORD),
  validate(rentalIdValidationSchema),
  rentalController.rejectRentalRequest,
);

export const RentalRoutes = router;
