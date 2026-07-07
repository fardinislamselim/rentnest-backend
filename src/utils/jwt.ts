import httpStatus from "http-status";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import AppError from "../errors/AppError";

type TokenPayload = JwtPayload & {
  id?: string | number;
  userId?: string | number;
  email?: string;
  role?: string;
  name?: string;
};

const createToken = (
  payload: TokenPayload,
  secret: string,
  expire: SignOptions,
) => {
  const token = jwt.sign(payload, secret, expire);
  return token;
};

const verifyToken = (token: string, secret: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") {
      throw new AppError(httpStatus.UNAUTHORIZED, "Token verification failed");
    }

    return decoded as TokenPayload;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.log("Token verification error", error);
    throw new AppError(httpStatus.UNAUTHORIZED, "Token verification failed");
  }
};

export { createToken, verifyToken };
