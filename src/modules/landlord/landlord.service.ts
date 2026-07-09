import {
  PaymentStatus,
  PropertyStatus,
  RentalStatus,
} from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getDashboard = async (userId: string) => {
  const [
    totalProperties,
    available,
    rented,
    pendingRequests,
    approvedRentals,
    paymentSumResult,
  ] = await Promise.all([
    prisma.property.count({ where: { landlordId: userId } }),
    prisma.property.count({
      where: { landlordId: userId, status: PropertyStatus.AVAILABLE },
    }),
    prisma.property.count({
      where: { landlordId: userId, status: PropertyStatus.RENTED },
    }),
    prisma.rentalRequest.count({
      where: {
        property: { landlordId: userId },
        status: RentalStatus.PENDING,
      },
    }),
    prisma.rentalRequest.count({
      where: {
        property: { landlordId: userId },
        status: RentalStatus.APPROVED,
      },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: PaymentStatus.COMPLETED,
        rentalRequest: { property: { landlordId: userId } },
      },
    }),
  ]);

  return {
    totalProperties,
    available,
    rented,
    pendingRequests,
    approvedRentals,
    totalIncome: paymentSumResult._sum.amount ?? 0,
  };
};

export const landlordService = {
  getDashboard,
};
