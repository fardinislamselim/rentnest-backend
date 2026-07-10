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

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     description: Create a new property category. Only administrators can create categories.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Apartment
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       409:
 *         description: Category already exists.
 */
router.post(
  "/",
  auth(Role.ADMIN),
  validate(createCategoryValidationSchema),
  categoryController.createCategory,
);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve all available property categories.
 *     tags:
 *       - Categories
 *     security: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/", categoryController.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Retrieve a specific property category.
 *     tags:
 *       - Categories
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 11d1b9e8-9b0c-4bdf-aeea-21d6f571faff
 *     responses:
 *       200:
 *         description: Category retrieved successfully.
 *       400:
 *         description: Invalid category ID.
 *       404:
 *         description: Category not found.
 */
router.get(
  "/:id",
  validate(categoryIdValidationSchema),
  categoryController.getSingleCategory,
);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update category
 *     description: Update an existing property category. Only administrators can update categories.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 11d1b9e8-9b0c-4bdf-aeea-21d6f571faff
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Luxury Apartment
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Category not found.
 */
router.patch(
  "/:id",
  auth(Role.ADMIN),
  validate(updateCategoryValidationSchema),
  categoryController.updateCategory,
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category
 *     description: Delete a property category. Only administrators can delete categories.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 11d1b9e8-9b0c-4bdf-aeea-21d6f571faff
 *     responses:
 *       200:
 *         description: Category deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Category not found.
 */
router.delete(
  "/:id",
  auth(Role.ADMIN),
  validate(categoryIdValidationSchema),
  categoryController.deleteCategory,
);

export const CategoryRoutes = router;
