import { z } from "zod";

export const createPropertyValidationSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    location: z.string().min(3, "Location is required"),
    price: z.number().positive("Price must be positive"),
    bedrooms: z.number().int().positive("Bedrooms must be positive"),
    bathrooms: z.number().int().positive("Bathrooms must be positive"),
    size: z.number().int().positive().optional(),
    images: z.array(z.string().url()).optional(),
    status: z.enum(["AVAILABLE", "RENTED", "UNAVAILABLE"]).optional(),
    categoryId: z.string().min(1, "Category id is required"),
  }),
});

export const updatePropertyValidationSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .optional(),
    location: z.string().min(3, "Location is required").optional(),
    price: z.number().positive("Price must be positive").optional(),
    bedrooms: z.number().int().positive("Bedrooms must be positive").optional(),
    bathrooms: z
      .number()
      .int()
      .positive("Bathrooms must be positive")
      .optional(),
    size: z.number().int().positive().optional(),
    images: z.array(z.string().url()).optional(),
    status: z.enum(["AVAILABLE", "RENTED", "UNAVAILABLE"]).optional(),
    categoryId: z.string().min(1, "Category id is required").optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Property id is required"),
  }),
});

export const updatePropertyStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["AVAILABLE", "RENTED", "UNAVAILABLE"]),
  }),
  params: z.object({
    id: z.string().min(1, "Property id is required"),
  }),
});

export const propertyIdValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Property id is required"),
  }),
});
