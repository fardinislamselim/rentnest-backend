import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { Role, UserStatus } from "../../generated/prisma/enums";
import config from "../config";
import AppError from "../errors/AppError";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

const auth =
  (...requiredRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken
        ? req.cookies.accessToken
        : req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization?.split(" ")[1]
          : req.headers.authorization;

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const decoded = verifyToken(token, config.jwt_access_secret);
      const userId = decoded.userId ?? decoded.id;

      if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token payload");
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

      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
      }

      req.user = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
