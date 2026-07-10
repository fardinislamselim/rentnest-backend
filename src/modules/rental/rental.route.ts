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

/**
 * @swagger
 * /rentals:
 *   post:
 *     summary: Submit a rental request
 *     description: Submit a rental request for an available property. Tenants cannot request their own property or create duplicate pending requests.
 *     tags:
 *       - Rental Requests
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
 *               - startDate
 *               - endDate
 *             properties:
 *               propertyId:
 *                 type: string
 *                 format: uuid
 *                 example: 56b45597-83f6-4d3b-8f92-51080c9d765f
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-09-15
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2027-03-15
 *     responses:
 *       201:
 *         description: Rental request submitted successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Tenant access required or cannot request own property.
 *       404:
 *         description: Property not found.
 *       409:
 *         description: Rental request already exists.
 */
router.post(
  "/",
  auth(Role.TENANT),
  validate(createRentalValidationSchema),
  rentalController.createRentalRequest,
);

/**
 * @swagger
 * /rentals/my-rentals:
 *   get:
 *     summary: Get my rental requests
 *     description: Retrieve all rental requests submitted by the authenticated tenant.
 *     tags:
 *       - Rental Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rental requests retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Tenant access required.
 */
router.get(
  "/my-rentals",
  auth(Role.TENANT),
  rentalController.getMyRentalRequests,
);

/**
 * @swagger
 * /rentals/requests:
 *   get:
 *     summary: Get landlord rental requests
 *     description: Retrieve all rental requests for properties owned by the authenticated landlord.
 *     tags:
 *       - Rental Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rental requests retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Landlord access required.
 */
router.get(
  "/requests",
  auth(Role.LANDLORD),
  rentalController.getLandlordRentalRequests,
);

/**
 * @swagger
 * /rentals/history:
 *   get:
 *     summary: Get rental history
 *     description: Retrieve the rental history for the authenticated landlord.
 *     tags:
 *       - Rental Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rental history retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Landlord access required.
 */
router.get("/history", auth(Role.LANDLORD), rentalController.getRentalHistory);

/**
 * @swagger
 * /rentals/{id}:
 *   get:
 *     summary: Get rental request details
 *     description: Retrieve detailed information about a rental request. Accessible by the tenant, property owner, or admin.
 *     tags:
 *       - Rental Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Rental Request ID
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 3b4f7fda-6a41-486e-baa3-54178270c71d
 *     responses:
 *       200:
 *         description: Rental request retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Rental request not found.
 */
router.get(
  "/:id",
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  validate(rentalIdValidationSchema),
  rentalController.getSingleRentalRequest,
);

/**
 * @swagger
 * /rentals/{id}/cancel:
 *   patch:
 *     summary: Cancel rental request
 *     description: Cancel a pending rental request submitted by the authenticated tenant.
 *     tags:
 *       - Rental Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Rental request cancelled successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: You are not allowed to cancel this rental request.
 *       404:
 *         description: Rental request not found.
 */
router.patch(
  "/:id/cancel",
  auth(Role.TENANT),
  validate(rentalIdValidationSchema),
  rentalController.cancelRentalRequest,
);

/**
 * @swagger
 * /rentals/{id}/approve:
 *   patch:
 *     summary: Approve rental request
 *     description: Approve a rental request for a property owned by the authenticated landlord.
 *     tags:
 *       - Rental Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Rental request approved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: You are not the owner of this property.
 *       404:
 *         description: Rental request not found.
 */
router.patch(
  "/:id/approve",
  auth(Role.LANDLORD),
  validate(rentalIdValidationSchema),
  rentalController.approveRentalRequest,
);

/**
 * @swagger
 * /rentals/{id}/reject:
 *   patch:
 *     summary: Reject rental request
 *     description: Reject a rental request for a property owned by the authenticated landlord.
 *     tags:
 *       - Rental Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Rental request rejected successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: You are not the owner of this property.
 *       404:
 *         description: Rental request not found.
 */
router.patch(
  "/:id/reject",
  auth(Role.LANDLORD),
  validate(rentalIdValidationSchema),
  rentalController.rejectRentalRequest,
);

export const RentalRoutes = router;
