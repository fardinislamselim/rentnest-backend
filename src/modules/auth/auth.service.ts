import bcrypt from "bcrypt";
import httpStatus from "http-status";

import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import { IRegisterUser } from "./auth.interface";
import config from "../../config";

const registerUser = async (payload: IRegisterUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isUserExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists with this email",
    );
  }

  const hashedPassword = bcrypt.hashSync(
    payload.password,
    config.bcrypt_salt_rounds,
  );

  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      bio: true,
      status: true,
      createdAt: true,
    },
  });

  return result;
};

export const AuthService = {
  registerUser,
};
