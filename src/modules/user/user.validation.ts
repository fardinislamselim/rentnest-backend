import { z } from "zod";

export const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().optional(),
    bio: z.string().optional(),
  }),
});

export const updateProfilePictureValidationSchema = z.object({
  body: z.object({
    avatar: z.string().url("Avatar must be a valid URL"),
  }),
});

export const userIdValidationSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});