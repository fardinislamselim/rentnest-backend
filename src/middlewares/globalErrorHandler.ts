import type { ErrorRequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";

import { Prisma } from "../../generated/prisma/client";
import AppError from "../errors/AppError";
import { handleJWTError } from "../errors/handleJWTError";
import { handlePrismaError } from "../errors/handlePrismaError";
import { handleZodError } from "../errors/handleZodError";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorDetails: unknown = null;

  if (error instanceof ZodError) {
    const simplified = handleZodError(error);

    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplified = handlePrismaError(error);

    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  } else if (
    error instanceof jwt.JsonWebTokenError ||
    error instanceof jwt.TokenExpiredError
  ) {
    const simplified = handleJWTError(error);

    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};
