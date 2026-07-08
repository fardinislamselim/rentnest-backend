import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { propertyService } from "./property.service";

const createProperty = catchAsync(async (req, res) => {
  const result = await propertyService.createProperty(
    req.user.userId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property created successfully",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req, res) => {
  const result = await propertyService.getAllProperties(req.query as any);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleProperty = catchAsync(async (req, res) => {
  const propertyId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await propertyService.getSingleProperty(propertyId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property retrieved successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req, res) => {
  const propertyId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await propertyService.updateProperty(
    req.user.userId,
    propertyId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property updated successfully",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req, res) => {
  const propertyId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  await propertyService.deleteProperty(req.user.userId, propertyId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property deleted successfully",
    data: null,
  });
});

const updatePropertyStatus = catchAsync(async (req, res) => {
  const propertyId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await propertyService.updatePropertyStatus(
    req.user.userId,
    propertyId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property status updated successfully",
    data: result,
  });
});

const getOwnProperties = catchAsync(async (req, res) => {
  const result = await propertyService.getOwnProperties(req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Own properties retrieved successfully",
    data: result,
  });
});

export const propertyController = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  getOwnProperties,
};
