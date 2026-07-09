import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { adminController } from "./admin.controller";
import {
  adminPropertyQuerySchema,
  adminRentalQuerySchema,
  propertyIdValidationSchema,
  updateUserStatusSchema,
  userIdValidationSchema,
} from "./admin.validation";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getUsers);

router.get(
  "/users/:id",
  auth(Role.ADMIN),
  validate(userIdValidationSchema),
  adminController.getUserById,
);

router.patch(
  "/users/:id/status",
  auth(Role.ADMIN),
  validate(updateUserStatusSchema),
  adminController.updateUserStatus,
);

router.delete(
  "/users/:id",
  auth(Role.ADMIN),
  validate(userIdValidationSchema),
  adminController.deleteUser,
);

router.get(
  "/properties",
  auth(Role.ADMIN),
  validate(adminPropertyQuerySchema),
  adminController.getProperties,
);

router.delete(
  "/properties/:id",
  auth(Role.ADMIN),
  validate(propertyIdValidationSchema),
  adminController.deleteProperty,
);

router.get(
  "/rentals",
  auth(Role.ADMIN),
  validate(adminRentalQuerySchema),
  adminController.getRentals,
);

router.get("/dashboard", auth(Role.ADMIN), adminController.getDashboard);

export const AdminRoutes = router;
