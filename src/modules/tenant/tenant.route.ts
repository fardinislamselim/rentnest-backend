import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { tenantController } from "./tenant.controller";

const router = Router();

/**
 * @swagger
 * /tenant/dashboard:
 *   get:
 *     summary: Get tenant dashboard
 *     description: Retrieve dashboard statistics for the authenticated tenant, including rental requests, active rentals, completed rentals, payment history, and recent activities.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Dashboard data retrieved successfully.
 *               data:
 *                 totalRentalRequests: 8
 *                 pendingRequests: 2
 *                 approvedRequests: 3
 *                 activeRentals: 2
 *                 completedRentals: 1
 *                 totalPayments: 180000
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Access denied. Tenant role required.
 *       500:
 *         description: Internal server error.
 */
router.get("/dashboard", auth(Role.TENANT), tenantController.getDashboard);

export const TenantRoutes = router;
