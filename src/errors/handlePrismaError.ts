import type { Prisma } from "../../generated/prisma/client";

export const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError,
) => {
  if (error.code === "P2002") {
    return {
      statusCode: 409,
      message: "Duplicate value found",
      errorDetails: error.meta,
    };
  }

  if (error.code === "P2025") {
    return {
      statusCode: 404,
      message: "Record not found",
      errorDetails: null,
    };
  }

  return {
    statusCode: 400,
    message: "Database Error",
    errorDetails: error.message,
  };
};
