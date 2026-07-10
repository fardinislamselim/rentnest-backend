import { Router } from "express";

import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { authController } from "./auth.controller";
import {
  changePasswordValidationSchema,
  loginValidationSchema,
  registerValidationSchema,
} from "./auth.validation";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new Tenant or Landlord account.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fardin Islam
 *               email:
 *                 type: string
 *                 format: email
 *                 example: fardin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *               phone:
 *                 type: string
 *                 example: "+8801712345678"
 *               avatar:
 *                 type: string
 *                 example: https://i.pravatar.cc/300
 *               bio:
 *                 type: string
 *                 example: Property owner with multiple rental apartments.
 *               role:
 *                 type: string
 *                 enum: [TENANT, LANDLORD]
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Validation failed.
 *       409:
 *         description: User already exists.
 */
router.post(
  "/register",
  validate(registerValidationSchema),
  authController.registerUser,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user using email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: fardin@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Invalid credentials.
 *       403:
 *         description: User account is blocked.
 */
router.post(
  "/login",
  validate(loginValidationSchema),
  authController.loginUser,
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Generate a new access token using the refresh token stored in cookies.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 *       401:
 *         description: Refresh token missing.
 *       403:
 *         description: Invalid or expired refresh token.
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the authenticated user's profile.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.get("/me", auth(), authController.getMe);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logout the authenticated user by clearing access and refresh token cookies.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful.
 *       401:
 *         description: Unauthorized.
 */
router.post("/logout", authController.logoutUser);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Change password
 *     description: Change the authenticated user's password.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: Password@123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Incorrect old password.
 *       401:
 *         description: Unauthorized.
 *       422:
 *         description: Validation failed.
 */
router.patch(
  "/change-password",
  auth(),
  validate(changePasswordValidationSchema),
  authController.changePassword,
);

export const AuthRoutes = router;
