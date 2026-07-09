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

export const adminService = {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
};
