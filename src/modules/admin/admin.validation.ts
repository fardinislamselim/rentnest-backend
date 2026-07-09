import { z } from "zod";

export const userIdValidationSchema = z.object({
  params: z.object({ id: z.string().uuid("Invalid user id") }),
});

export const updateUserStatusSchema = z.object({
  params: z.object({ id: z.string().uuid("Invalid user id") }),
  body: z.object({ status: z.enum(["ACTIVE", "BANNED"]) }),
});

export const propertyIdValidationSchema = z.object({
  params: z.object({ id: z.string().uuid("Invalid property id") }),
});

export const adminPropertyQuerySchema = z.object({
  query: z.object({
    page: z.preprocess(
      (val) => (typeof val === "string" ? Number(val) : val),
      z.number().int().min(1).optional(),
    ),
    limit: z.preprocess(
      (val) => (typeof val === "string" ? Number(val) : val),
      z.number().int().min(1).max(100).optional(),
    ),
    status: z.enum(["AVAILABLE", "RENTED", "UNAVAILABLE"]).optional(),
    location: z.string().min(1, "Invalid location").optional(),
    categoryId: z.string().uuid("Invalid category id").optional(),
    search: z.string().min(1, "Invalid search text").optional(),
    sortBy: z.enum(["price", "createdAt", "title", "location"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export const adminRentalQuerySchema = z.object({
  query: z.object({
    page: z.preprocess(
      (val) => (typeof val === "string" ? Number(val) : val),
      z.number().int().min(1).optional(),
    ),
    limit: z.preprocess(
      (val) => (typeof val === "string" ? Number(val) : val),
      z.number().int().min(1).max(100).optional(),
    ),
    status: z
      .enum(["PENDING", "APPROVED", "REJECTED", "ACTIVE", "COMPLETED"])
      .optional(),
    search: z.string().min(1, "Invalid search text").optional(),
    sortBy: z.enum(["createdAt", "startDate", "endDate", "status"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
