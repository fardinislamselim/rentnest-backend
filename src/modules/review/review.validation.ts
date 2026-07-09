import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid("Invalid property id"),
    rating: z
      .number()
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5"),
    comment: z.string().min(1, "Comment is required"),
  }),
});

export const updateReviewSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid review id"),
  }),
  body: z
    .object({
      rating: z
        .number()
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5")
        .optional(),
      comment: z.string().min(1, "Comment is required").optional(),
    })
    .refine((data) => data.rating !== undefined || data.comment !== undefined, {
      message: "At least one field is required",
    }),
});

export const reviewIdValidationSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid review id"),
  }),
});
