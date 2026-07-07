import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { SignOptions } from "jsonwebtoken";

import { UserStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { createToken, verifyToken } from "../../utils/jwt";
import { ILoginUser, IRegisterUser } from "./auth.interface";

// register user
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

// login user
const loginUser = async (payload: ILoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status === UserStatus.BANNED) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in as string } as SignOptions,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    { expiresIn: config.jwt_refresh_expires_in as string } as SignOptions,
  );

  return { accessToken, refreshToken };
};

// refresh token
const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is required");
  }

  const decoded = verifyToken(token, config.jwt_refresh_secret);
  const userId = decoded.userId ?? decoded.id;

  if (!userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid refresh token payload",
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId as string,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status === UserStatus.BANNED) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in as string } as SignOptions,
  );

  return {
    accessToken,
  };
};

// get me
const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

// change password
const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Current password is incorrect",
    );
  }

  const hashedPassword = bcrypt.hashSync(
    newPassword,
    config.bcrypt_salt_rounds,
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  return null;
};

export const authService = {
  registerUser,
  loginUser,
  refreshToken,
  getMe,
  changePassword,
};
