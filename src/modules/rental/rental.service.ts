import httpStatus from "http-status";

import { PropertyStatus, RentalStatus } from "../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateRentalRequest, IUpdateRentalStatus } from "./rental.interface";

const createRentalRequest = async (
  userId: string,
  payload: ICreateRentalRequest,
) => {
  const property = await prisma.property.findUnique({
    where: { id: payload.propertyId },
    include: { landlord: { omit: { password: true } } },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId === userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot request your own property",
    );
  }

  const existingPending = await prisma.rentalRequest.findFirst({
    where: {
      tenantId: userId,
      propertyId: payload.propertyId,
      status: RentalStatus.PENDING,
    },
  });

  if (existingPending) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You already have a pending request for this property",
    );
  }

  if (property.status !== PropertyStatus.AVAILABLE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Property is not available for rental",
    );
  }

  return prisma.rentalRequest.create({
    data: {
      tenantId: userId,
      propertyId: payload.propertyId,
      startDate: new Date(payload.startDate),
      endDate: payload.endDate ? new Date(payload.endDate) : null,
      status: RentalStatus.PENDING,
    },
    include: {
      property: {
        include: {
          category: true,
          landlord: { omit: { password: true } },
        },
      },
      tenant: { omit: { password: true } },
    },
  });
};

const getMyRentalRequests = async (userId: string) => {
  return prisma.rentalRequest.findMany({
    where: { tenantId: userId },
    include: {
      property: {
        include: {
          category: true,
          landlord: { omit: { password: true } },
        },
      },
      tenant: { omit: { password: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getSingleRentalRequest = async (userId: string, rentalId: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
    include: {
      property: {
        include: {
          category: true,
          landlord: { omit: { password: true } },
        },
      },
      tenant: { omit: { password: true } },
      payment: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  const isTenant = rental.tenantId === userId;
  const isLandlord = rental.property.landlordId === userId;

  if (!isTenant && !isLandlord) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  return rental;
};

const cancelRentalRequest = async (userId: string, rentalId: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rental.tenantId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (rental.status !== RentalStatus.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending requests can be cancelled",
    );
  }

  return prisma.rentalRequest.update({
    where: { id: rentalId },
    data: { status: RentalStatus.REJECTED },
    include: {
      property: {
        include: {
          category: true,
          landlord: { omit: { password: true } },
        },
      },
      tenant: { omit: { password: true } },
      payment: true,
    },
  });
};

const getLandlordRentalRequests = async (userId: string) => {
  return prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId: userId,
      },
    },
    include: {
      property: {
        include: {
          category: true,
          landlord: { omit: { password: true } },
        },
      },
      tenant: { omit: { password: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateRentalStatus = async (
  userId: string,
  rentalId: string,
  payload: IUpdateRentalStatus,
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
    include: { property: true },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rental.property.landlordId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (payload.status === RentalStatus.APPROVED) {
    if (rental.status !== RentalStatus.PENDING) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Only pending requests can be approved",
      );
    }

    await prisma.property.update({
      where: { id: rental.propertyId },
      data: { status: PropertyStatus.RENTED },
    });
  }

  if (payload.status === RentalStatus.REJECTED) {
    if (rental.status !== RentalStatus.PENDING) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Only pending requests can be rejected",
      );
    }
  }

  if (
    payload.status === RentalStatus.ACTIVE ||
    payload.status === RentalStatus.COMPLETED
  ) {
    if (rental.status !== RentalStatus.APPROVED) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Only approved requests can be marked active or completed",
      );
    }
  }

  return prisma.rentalRequest.update({
    where: { id: rentalId },
    data: { status: payload.status as RentalStatus },
    include: {
      property: {
        include: {
          category: true,
          landlord: { omit: { password: true } },
        },
      },
      tenant: { omit: { password: true } },
      payment: true,
    },
  });
};

const approveRentalRequest = async (userId: string, rentalId: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
    include: { property: true },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rental.property.landlordId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (rental.status !== RentalStatus.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending requests can be approved",
    );
  }

  await prisma.property.update({
    where: { id: rental.propertyId },
    data: { status: PropertyStatus.RENTED },
  });

  return prisma.rentalRequest.update({
    where: { id: rentalId },
    data: { status: RentalStatus.APPROVED },
    include: {
      property: {
        include: {
          category: true,
          landlord: { omit: { password: true } },
        },
      },
      tenant: { omit: { password: true } },
      payment: true,
    },
  });
};

const rejectRentalRequest = async (userId: string, rentalId: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
    include: { property: true },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rental.property.landlordId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (rental.status !== RentalStatus.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending requests can be rejected",
    );
  }

  return prisma.rentalRequest.update({
    where: { id: rentalId },
    data: { status: RentalStatus.REJECTED },
    include: {
      property: {
        include: {
          category: true,
          landlord: { omit: { password: true } },
        },
      },
      tenant: { omit: { password: true } },
      payment: true,
    },
  });
};

const getRentalHistory = async (userId: string) => {
  return prisma.rentalRequest.findMany({
    where: {
      OR: [{ tenantId: userId }, { property: { landlordId: userId } }],
    },
    include: {
      property: {
        include: {
          category: true,
          landlord: { omit: { password: true } },
        },
      },
      tenant: { omit: { password: true } },
      payment: true,
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const rentalService = {
  createRentalRequest,
  getMyRentalRequests,
  getSingleRentalRequest,
  cancelRentalRequest,
  getLandlordRentalRequests,
  updateRentalStatus,
  approveRentalRequest,
  rejectRentalRequest,
  getRentalHistory,
};
