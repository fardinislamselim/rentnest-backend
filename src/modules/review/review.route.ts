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

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a review
 *     description: Create a review for a completed rental property. Only tenants who have completed a rental can submit one review per property.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *               - rating
 *             properties:
 *               propertyId:
 *                 type: string
 *                 format: uuid
 *                 example: a860bddd-e4ec-4cc0-abea-340f88669260
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent apartment with modern facilities. The landlord was very cooperative.
 *     responses:
 *       201:
 *         description: Review created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Rental not completed.
 *       404:
 *         description: Property not found.
 *       409:
 *         description: Review already exists.
 */
router.post(
  "/",
  auth(Role.TENANT),
  validate(createReviewSchema),
  reviewController.createReview,
);

/**
 * @swagger
 * /reviews/properties/{id}:
 *   get:
 *     summary: Get property reviews
 *     description: Retrieve all reviews for a specific property.
 *     tags:
 *       - Reviews
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Property ID
 *         schema:
 *           type: string
 *           format: uuid
 *           example: a860bddd-e4ec-4cc0-abea-340f88669260
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully.
 *       400:
 *         description: Invalid property ID.
 *       404:
 *         description: Property not found.
 */
router.get("/properties/:id", reviewController.getReviewsByPropertyId);

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     summary: Update review
 *     description: Update a review created by the authenticated tenant.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 2004cc78-e92a-4d4c-b0ff-e9f7b68e1b3f
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: After staying for several months, I found the apartment very comfortable and secure.
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: You are not the owner of this review.
 *       404:
 *         description: Review not found.
 */
router.patch(
  "/:id",
  auth(Role.TENANT),
  validate(updateReviewSchema),
  reviewController.updateReview,
);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     description: Delete a review created by the authenticated tenant.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 2004cc78-e92a-4d4c-b0ff-e9f7b68e1b3f
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: You are not the owner of this review.
 *       404:
 *         description: Review not found.
 */
router.delete(
  "/:id",
  auth(Role.TENANT),
  validate(reviewIdValidationSchema),
  reviewController.deleteReview,
);

export const ReviewRoutes = router;
