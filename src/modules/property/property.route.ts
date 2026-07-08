import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { propertyController } from "./property.controller";
import {
  createPropertyValidationSchema,
  propertyIdValidationSchema,
  updatePropertyStatusValidationSchema,
  updatePropertyValidationSchema,
} from "./property.validation";

const router = Router();

router.post(
  "/",
  auth(Role.LANDLORD),
  validate(createPropertyValidationSchema),
  propertyController.createProperty,
);

router.get("/", propertyController.getAllProperties);

router.get(
  "/:id",
  validate(propertyIdValidationSchema),
  propertyController.getSingleProperty,
);

router.patch(
  "/:id",
  auth(Role.LANDLORD),
  validate(updatePropertyValidationSchema),
  propertyController.updateProperty,
);

router.delete(
  "/:id",
  auth(Role.LANDLORD),
  validate(propertyIdValidationSchema),
  propertyController.deleteProperty,
);

router.patch(
  "/:id/status",
  auth(Role.LANDLORD),
  validate(updatePropertyStatusValidationSchema),
  propertyController.updatePropertyStatus,
);

router.get(
  "/my-properties",
  auth(Role.LANDLORD),
  propertyController.getOwnProperties,
);

export const PropertyRoutes = router;
