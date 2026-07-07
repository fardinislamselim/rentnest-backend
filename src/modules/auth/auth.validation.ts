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

export const changePasswordValidationSchema = z.object({
  body: z
    .object({
      currentPassword: z
        .string()
        .min(1, "Current password is required")
        .optional(),
      oldPassword: z.string().min(1, "Current password is required").optional(),
      newPassword: z
        .string()
        .min(6, "New password must be at least 6 characters")
        .optional(),
      password: z
        .string()
        .min(6, "New password must be at least 6 characters")
        .optional(),
    })
    .superRefine((data, ctx) => {
      const currentPassword = data.currentPassword ?? data.oldPassword;
      const newPassword = data.newPassword ?? data.password;

      if (!currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["currentPassword"],
          message: "Current password is required",
        });
      }

      if (!newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["newPassword"],
          message: "New password must be at least 6 characters",
        });
      }
    }),
});
