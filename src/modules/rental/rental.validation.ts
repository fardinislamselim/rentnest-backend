import { z } from "zod";

export const createRentalValidationSchema = z.object({
  body: z.object({
    propertyId: z.string().min(1, "Property id is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
  }),
});

export const rentalIdValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Rental request id is required"),
  }),
});

export const updateRentalStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED", "ACTIVE", "COMPLETED"]),
  }),
  params: z.object({
    id: z.string().min(1, "Rental request id is required"),
  }),
});
