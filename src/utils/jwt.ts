import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expire: SignOptions,
) => {
  const token = jwt.sign(payload, secret, expire);
  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.log("Token verfication error", error);
    throw new AppError(httpStatus.UNAUTHORIZED, "Token verification failed");
  }
};

export { createToken, verifyToken };
