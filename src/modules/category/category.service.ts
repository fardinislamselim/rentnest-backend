import httpStatus from "http-status";

import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateCategory, IUpdateCategory } from "./category.interface";

const createCategory = async (payload: ICreateCategory) => {
  const normalizedName = payload.name.trim();

  const existingCategory = await prisma.category.findUnique({
    where: {
      name: normalizedName,
    },
  });

  if (existingCategory) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }

  return prisma.category.create({
    data: {
      name: normalizedName,
    },
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

const updateCategory = async (categoryId: string, payload: IUpdateCategory) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!existingCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  if (payload.name) {
    const normalizedName = payload.name.trim();

    const categoryWithSameName = await prisma.category.findUnique({
      where: {
        name: normalizedName,
      },
    });

    if (categoryWithSameName && categoryWithSameName.id !== categoryId) {
      throw new AppError(httpStatus.CONFLICT, "Category already exists");
    }

    return prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: normalizedName,
      },
    });
  }

  return existingCategory;
};

const deleteCategory = async (categoryId: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!existingCategory) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  return null;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
