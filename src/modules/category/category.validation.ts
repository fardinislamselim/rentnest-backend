import { z } from "zod";

export const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
  }),
});

export const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Category name must be at least 2 characters")
      .optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Category id is required"),
  }),
});

export const categoryIdValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Category id is required"),
  }),
});
