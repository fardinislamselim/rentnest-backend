import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";


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

const getPublicProfile = catchAsync(async (req, res) => {
  const result = await userService.getPublicProfile(req.params.id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});


export const userController = {
  updateProfile,
  updateProfilePicture,
  getPublicProfile,
};
