import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";

// register user
const registerUser = catchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

// login user
const loginUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const { accessToken, refreshToken } = await authService.loginUser(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 24 hours 1 day
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: { accessToken, refreshToken },
  });
});

// refresh token
const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;

  const { accessToken } = await authService.refreshToken(token);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Access token refreshed successfully",
    data: accessToken,
  });
});

// get me
const getMe = catchAsync(async (req, res) => {
  const result = await authService.getMe(req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

// logout user
const logoutUser = catchAsync(async (_req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "none",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged out successfully",
    data: null,
  });
});

// change password
const changePassword = catchAsync(async (req, res) => {
  const currentPassword = req.body.currentPassword ?? req.body.oldPassword;
  const newPassword = req.body.newPassword ?? req.body.password;

  await authService.changePassword(
    req.user.userId,
    currentPassword,
    newPassword,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: null,
  });
});

export const authController = {
  registerUser,
  loginUser,
  refreshToken,
  getMe,
  logoutUser,
  changePassword,
};
