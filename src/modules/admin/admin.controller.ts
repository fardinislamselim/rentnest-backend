import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const getUsers = catchAsync(async (req, res) => {
  const result = await adminService.getUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const userId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await adminService.getUserById(userId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const userId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await adminService.updateUserStatus(
    userId as string,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const userId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  await adminService.deleteUser(userId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted",
    data: null,
  });
});

export const adminController = {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
};
