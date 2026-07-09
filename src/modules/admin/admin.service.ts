import httpStatus from "http-status";

import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateUserStatusPayload } from "./admin.interface";

const getUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      bio: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateUserStatus = async (
  userId: string,
  payload: IUpdateUserStatusPayload,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { status: payload.status },
  });
};

const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  await prisma.user.delete({ where: { id: userId } });

  return null;
};

interface IGetAdminPropertiesQuery {
  page?: number | string;
  limit?: number | string;
  status?: "AVAILABLE" | "RENTED" | "UNAVAILABLE";
  location?: string;
  categoryId?: string;
  search?: string;
  sortBy?: "price" | "createdAt" | "title" | "location";
  sortOrder?: "asc" | "desc";
}

const toPageValue = (page?: number | string) => {
  const value = typeof page === "string" ? Number(page) : page;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 1) {
    return 1;
  }
  return Math.floor(value);
};

const toLimitValue = (limit?: number | string) => {
  const value = typeof limit === "string" ? Number(limit) : limit;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 1) {
    return 10;
  }
  return Math.floor(value);
};

const getProperties = async (query: IGetAdminPropertiesQuery = {}) => {
  const {
    status,
    location,
    categoryId,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const page = toPageValue(query.page);
  const limit = toLimitValue(query.limit);

  const where: Record<string, any> = {};

  if (status) {
    where.status = status;
  }

  if (location) {
    where.location = { contains: location, mode: "insensitive" };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy = { [sortBy]: sortOrder };

  const total = await prisma.property.count({ where });

  const data = await prisma.property.findMany({
    where,
    select: {
      id: true,
      title: true,
      location: true,
      price: true,
      status: true,
      landlordId: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    data,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const deleteProperty = async (propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  await prisma.property.delete({ where: { id: propertyId } });
  return null;
};

interface IGetAdminRentalsQuery {
  page?: number | string;
  limit?: number | string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
  search?: string;
  sortBy?: "createdAt" | "startDate" | "endDate" | "status";
  sortOrder?: "asc" | "desc";
}

const getRentals = async (query: IGetAdminRentalsQuery = {}) => {
  const page = toPageValue(query.page);
  const limit = toLimitValue(query.limit);
  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder ?? "desc";

  const where: Record<string, any> = {};
  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      { tenant: { name: { contains: query.search, mode: "insensitive" } } },
      { tenant: { email: { contains: query.search, mode: "insensitive" } } },
      { property: { title: { contains: query.search, mode: "insensitive" } } },
      {
        property: { location: { contains: query.search, mode: "insensitive" } },
      },
    ];
  }

  const total = await prisma.rentalRequest.count({ where });
  const data = await prisma.rentalRequest.findMany({
    where,
    include: {
      property: { select: { id: true, title: true, location: true } },
      tenant: { select: { id: true, name: true, email: true } },
    },
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    data,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export const adminService = {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getProperties,
  deleteProperty,
  getRentals,
};
