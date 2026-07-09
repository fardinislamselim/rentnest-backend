import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getDashboard = async (userId: string) => {
  const [
    pendingRentals,
    approvedRentals,
    activeRentals,
    completedRentals,
    paymentSumResult,
  ] = await Promise.all([
    prisma.rentalRequest.count({
      where: { tenantId: userId, status: RentalStatus.PENDING },
    }),
    prisma.rentalRequest.count({
      where: { tenantId: userId, status: RentalStatus.APPROVED },
    }),
    prisma.rentalRequest.count({
      where: { tenantId: userId, status: RentalStatus.ACTIVE },
    }),
    prisma.rentalRequest.count({
      where: { tenantId: userId, status: RentalStatus.COMPLETED },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: PaymentStatus.COMPLETED,
        rentalRequest: { tenantId: userId },
      },
    }),
  ]);

  return {
    pendingRentals,
    approvedRentals,
    activeRentals,
    completedRentals,
    totalPayments: paymentSumResult._sum.amount ?? 0,
  };
};

export const tenantService = {
  getDashboard,
};
