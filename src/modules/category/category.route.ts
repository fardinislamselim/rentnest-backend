import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { categoryController } from "./category.controller";
import {
  categoryIdValidationSchema,
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
} from "./category.validation";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  validate(createCategoryValidationSchema),
  categoryController.createCategory,
);

router.get("/", categoryController.getAllCategories);

router.get(
  "/:id",
  validate(categoryIdValidationSchema),
  categoryController.getSingleCategory,
);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  validate(updateCategoryValidationSchema),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  auth(Role.ADMIN),
  validate(categoryIdValidationSchema),
  categoryController.deleteCategory,
);

export const CategoryRoutes = router;
