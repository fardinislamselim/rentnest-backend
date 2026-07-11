import httpStatus from "http-status";

import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateProfile, IUpdateProfilePicture } from "./user.interface";


const updateProfile = async (userId: string, payload: IUpdateProfile) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: payload,
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

const updateProfilePicture = async (
  userId: string,
  payload: IUpdateProfilePicture,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatar: payload.avatar,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

const getPublicProfile = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    omit: {
      password: true,
    }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

export const userService = {
  updateProfile,
  updateProfilePicture,
  getPublicProfile,
};
