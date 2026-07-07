import jwt from "jsonwebtoken";

export const handleJWTError = (error: Error) => {
  if (error instanceof jwt.TokenExpiredError) {
    return {
      statusCode: 401,
      message: "Token expired",
      errorDetails: null,
    };
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return {
      statusCode: 401,
      message: "Invalid token",
      errorDetails: null,
    };
  }

  return {
    statusCode: 401,
    message: error.message,
    errorDetails: null,
  };
};
