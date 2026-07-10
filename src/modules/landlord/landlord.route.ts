import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { landlordController } from "./landlord.controller";

const router = Router();

/**
 * @swagger
 * /landlord/dashboard:
 *   get:
 *     summary: Get landlord dashboard
 *     description: Retrieve dashboard statistics for the authenticated landlord, including property overview, rental requests, earnings, and recent activities.
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
 *                 totalProperties: 12
 *                 availableProperties: 8
 *                 rentedProperties: 4
 *                 pendingRequests: 6
 *                 approvedRequests: 10
 *                 totalRevenue: 250000
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Access denied. Landlord role required.
 *       500:
 *         description: Internal server error.
 */
router.get("/dashboard", auth(Role.LANDLORD), landlordController.getDashboard);

export const LandlordRoutes = router;
