import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { propertyController } from "./property.controller";
import {
  createPropertyValidationSchema,
  propertyIdValidationSchema,
  updatePropertyStatusValidationSchema,
  updatePropertyValidationSchema,
} from "./property.validation";

const router = Router();

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property
 *     description: Create a new rental property listing. Only landlords can create properties.
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *               - price
 *               - bedrooms
 *               - bathrooms
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Luxury Apartment
 *               description:
 *                 type: string
 *                 example: Spacious apartment with modern facilities.
 *               location:
 *                 type: string
 *                 example: Dhaka
 *               price:
 *                 type: number
 *                 example: 25000
 *               bedrooms:
 *                 type: integer
 *                 example: 3
 *               bathrooms:
 *                 type: integer
 *                 example: 2
 *               size:
 *                 type: integer
 *                 example: 1500
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - https://example.com/image1.jpg
 *                   - https://example.com/image2.jpg
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Property created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Landlord access required.
 */
router.post(
  "/",
  auth(Role.LANDLORD),
  validate(createPropertyValidationSchema),
  propertyController.createProperty,
);

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Get all properties
 *     description: Retrieve all available properties with search, filtering, sorting and pagination.
 *     tags:
 *       - Properties
 *     security: []
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
 *           example: Dhaka
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: price
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Properties retrieved successfully.
 */
router.get("/", propertyController.getAllProperties);

/**
 * @swagger
 * /properties/my-properties:
 *   get:
 *     summary: Get landlord properties
 *     description: Retrieve all properties created by the authenticated landlord.
 *     tags:
 *       - Properties
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Properties retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Landlord access required.
 */
router.get(
  "/my-properties",
  auth(Role.LANDLORD),
  propertyController.getOwnProperties,
);

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Get property details
 *     description: Retrieve detailed information about a specific property.
 *     tags:
 *       - Properties
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Property retrieved successfully.
 *       404:
 *         description: Property not found.
 */
router.get(
  "/:id",
  validate(propertyIdValidationSchema),
  propertyController.getSingleProperty,
);

/**
 * @swagger
 * /properties/{id}:
 *   patch:
 *     summary: Update property
 *     description: Update an existing property. Only the owner landlord can update it.
 *     tags:
 *       - Properties
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
 *     responses:
 *       200:
 *         description: Property updated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Property not found.
 */
router.patch(
  "/:id",
  auth(Role.LANDLORD),
  validate(updatePropertyValidationSchema),
  propertyController.updateProperty,
);

/**
 * @swagger
 * /properties/{id}:
 *   delete:
 *     summary: Delete property
 *     description: Delete a property owned by the authenticated landlord.
 *     tags:
 *       - Properties
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
 *         description: Access denied.
 *       404:
 *         description: Property not found.
 */
router.delete(
  "/:id",
  auth(Role.LANDLORD),
  validate(propertyIdValidationSchema),
  propertyController.deleteProperty,
);

/**
 * @swagger
 * /properties/{id}/status:
 *   patch:
 *     summary: Update property status
 *     description: Update the availability status of a property (AVAILABLE or RENTED). Only the owner landlord can perform this action.
 *     tags:
 *       - Properties
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
 *                   - AVAILABLE
 *                   - RENTED
 *                 example: RENTED
 *     responses:
 *       200:
 *         description: Property status updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Property not found.
 */
router.patch(
  "/:id/status",
  auth(Role.LANDLORD),
  validate(updatePropertyStatusValidationSchema),
  propertyController.updatePropertyStatus,
);

export const PropertyRoutes = router;
