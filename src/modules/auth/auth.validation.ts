import { z } from "zod";

export const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),

    email: z.email(),

    password: z.string().min(6, "Password must be at least 6 characters"),

    phone: z.string().optional(),

    avatar: z.string().url().optional(),

    bio: z.string().optional(),

    role: z.enum(["TENANT", "LANDLORD"]),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(1, "Password is required"),
  }),
});
