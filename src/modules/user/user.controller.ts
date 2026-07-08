import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";

const getOwnProfile = catchAsync(async (req, res) => {
  const result = await userService.getOwnProfile(req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const result = await userService.updateProfile(req.user.userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result,
  });
});

const updateProfilePicture = catchAsync(async (req, res) => {
  const result = await userService.updateProfilePicture(
    req.user.userId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile picture updated successfully",
    data: result,
  });
});

export const userController = {
  getOwnProfile,
  updateProfile,
  updateProfilePicture,
};
