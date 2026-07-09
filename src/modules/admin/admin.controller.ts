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

const getProperties = catchAsync(async (req, res) => {
  const query = req.query as {
    page?: number | string;
    limit?: number | string;
    status?: "AVAILABLE" | "RENTED" | "UNAVAILABLE";
    location?: string;
    categoryId?: string;
    search?: string;
    sortBy?: "price" | "createdAt" | "title" | "location";
    sortOrder?: "asc" | "desc";
  };

  const result = await adminService.getProperties(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const deleteProperty = catchAsync(async (req, res) => {
  const propertyId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  await adminService.deleteProperty(propertyId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property deleted",
    data: null,
  });
});

const getRentals = catchAsync(async (req, res) => {
  const query = req.query as {
    page?: number | string;
    limit?: number | string;
    status?: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
    search?: string;
    sortBy?: "createdAt" | "startDate" | "endDate" | "status";
    sortOrder?: "asc" | "desc";
  };

  const result = await adminService.getRentals(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rentals retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getDashboard = catchAsync(async (_req, res) => {
  const result = await adminService.getDashboard();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin dashboard retrieved successfully",
    data: result,
  });
});

export const adminController = {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getProperties,
  deleteProperty,
  getRentals,
  getDashboard,
};
