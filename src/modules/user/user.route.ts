import { Router } from "express";

import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { userController } from "./user.controller";
import {
  updateProfilePictureValidationSchema,
  updateProfileValidationSchema,
} from "./user.validation";

const router = Router();

/**
 * @swagger
 * /user/profile:
 *   patch:
 *     summary: Update user profile
 *     description: Update the authenticated user's profile information such as name, phone number, avatar, and bio.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: "+8801712345678"
 *               bio:
 *                 type: string
 *                 example: Looking for a peaceful place to stay.
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.patch(
  "/profile",
  auth(),
  validate(updateProfileValidationSchema),
  userController.updateProfile,
);

/**
 * @swagger
 * /user/profile/picture:
 *   patch:
 *     summary: Update profile picture
 *     description: Update the authenticated user's profile picture.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/images/avatar.jpg
 *     responses:
 *       200:
 *         description: Profile picture updated successfully.
 *       400:
 *         description: Invalid avatar URL.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.patch(
  "/profile/picture",
  auth(),
  validate(updateProfilePictureValidationSchema),
  userController.updateProfilePicture,
);

export const UserRoutes = router;
