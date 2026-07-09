import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { reviewController } from "./review.controller";
import {
  createReviewSchema,
  reviewIdValidationSchema,
  updateReviewSchema,
} from "./review.validation";

const router = Router();

router.post(
  "/",
  auth(Role.TENANT),
  validate(createReviewSchema),
  reviewController.createReview,
);

router.get("/properties/:id", reviewController.getReviewsByPropertyId);

router.patch(
  "/:id",
  auth(Role.TENANT),
  validate(updateReviewSchema),
  reviewController.updateReview,
);

router.delete(
  "/:id",
  auth(Role.TENANT),
  validate(reviewIdValidationSchema),
  reviewController.deleteReview,
);

export const ReviewRoutes = router;
