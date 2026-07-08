import httpStatus from "http-status";

import { PropertyStatus } from "../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import {
  ICreateProperty,
  IUpdateProperty,
  IUpdatePropertyStatus,
} from "./property.interface";

const createProperty = async (userId: string, payload: ICreateProperty) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return prisma.property.create({
    data: {
      title: payload.title,
      description: payload.description,
      location: payload.location,
      price: payload.price,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      size: payload.size,
      images: payload.images ?? [],
      status: (payload.status as PropertyStatus) ?? PropertyStatus.AVAILABLE,
      categoryId: payload.categoryId,
      landlordId: userId,
    },
    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  });
};

interface IPropertyQuery {
  search?: string;
  categoryId?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}

const getAllProperties = async (query: IPropertyQuery) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
      { location: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.location) {
    where.location = { contains: query.location, mode: "insensitive" };
  }

  if (query.minPrice) {
    where.price = { gte: Number(query.minPrice) };
  }

  if (query.maxPrice) {
    where.price = { ...where.price, lte: Number(query.maxPrice) };
  }

  if (query.bedrooms) {
    where.bedrooms = Number(query.bedrooms);
  }

  if (query.bathrooms) {
    where.bathrooms = Number(query.bathrooms);
  }

  if (query.status) {
    where.status = query.status as PropertyStatus;
  }

  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        category: true,
        landlord: {
          omit: {
            password: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      } as any,
      skip,
      take: limit,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    data: properties,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getSingleProperty = async (propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  return property;
};

const updateProperty = async (
  userId: string,
  propertyId: string,
  payload: IUpdateProperty,
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }
  }

  return prisma.property.update({
    where: { id: propertyId },
    data: payload,
    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  });
};

const deleteProperty = async (userId: string, propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  await prisma.property.delete({ where: { id: propertyId } });

  return null;
};

const updatePropertyStatus = async (
  userId: string,
  propertyId: string,
  payload: IUpdatePropertyStatus,
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  return prisma.property.update({
    where: { id: propertyId },
    data: {
      status: payload.status as PropertyStatus,
    },
    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  });
};

const getOwnProperties = async (userId: string) => {
  return prisma.property.findMany({
    where: {
      landlordId: userId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const propertyService = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  getOwnProperties,
};
