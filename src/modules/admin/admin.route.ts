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

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a paginated list of all registered users. Only administrators can access this endpoint.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */
router.get("/users", auth(Role.ADMIN), adminController.getUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve detailed information about a specific user.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 229b0008-adfb-4949-8595-0590a0fba651
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *       400:
 *         description: Invalid user ID.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: User not found.
 */
router.get(
  "/users/:id",
  auth(Role.ADMIN),
  validate(userIdValidationSchema),
  adminController.getUserById,
);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     description: Update a user's account status (ACTIVE or BLOCKED).
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - ACTIVE
 *                   - BLOCKED
 *                 example: ACTIVE
 *     responses:
 *       200:
 *         description: User status updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: User not found.
 */
router.patch(
  "/users/:id/status",
  auth(Role.ADMIN),
  validate(updateUserStatusSchema),
  adminController.updateUserStatus,
);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Permanently delete a user account.
 *     tags:
 *       - Admin
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
 *         description: User deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: User not found.
 */
router.delete(
  "/users/:id",
  auth(Role.ADMIN),
  validate(userIdValidationSchema),
  adminController.deleteUser,
);

/**
 * @swagger
 * /admin/properties:
 *   get:
 *     summary: Get all properties
 *     description: Retrieve all property listings with filtering, searching, sorting and pagination.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Apartment
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: AVAILABLE
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           example: Dhaka
 *     responses:
 *       200:
 *         description: Properties retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */
router.get(
  "/properties",
  auth(Role.ADMIN),
  validate(adminPropertyQuerySchema),
  adminController.getProperties,
);

/**
 * @swagger
 * /admin/properties/{id}:
 *   delete:
 *     summary: Delete property
 *     description: Delete any property listing from the system.
 *     tags:
 *       - Admin
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
 *         description: Property deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Property not found.
 */
router.delete(
  "/properties/:id",
  auth(Role.ADMIN),
  validate(propertyIdValidationSchema),
  adminController.deleteProperty,
);

/**
 * @swagger
 * /admin/rentals:
 *   get:
 *     summary: Get all rental requests
 *     description: Retrieve all rental requests in the system with filtering, searching and pagination.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - PENDING
 *             - APPROVED
 *             - ACTIVE
 *             - COMPLETED
 *             - CANCELLED
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rental requests retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */
router.get(
  "/rentals",
  auth(Role.ADMIN),
  validate(adminRentalQuerySchema),
  adminController.getRentals,
);

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard
 *     description: Retrieve platform statistics including users, properties, rentals, payments and revenue.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 */
router.get("/dashboard", auth(Role.ADMIN), adminController.getDashboard);

export const AdminRoutes = router;
