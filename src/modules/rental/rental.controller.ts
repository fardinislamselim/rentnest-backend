import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./rental.service";

const createRentalRequest = catchAsync(async (req, res) => {
  const result = await rentalService.createRentalRequest(
    req.user.userId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental request submitted successfully",
    data: result,
  });
});

const getMyRentalRequests = catchAsync(async (req, res) => {
  const result = await rentalService.getMyRentalRequests(req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your rental requests retrieved successfully",
    data: result,
  });
});

const getSingleRentalRequest = catchAsync(async (req, res) => {
  const rentalId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await rentalService.getSingleRentalRequest(
    req.user.userId,
    rentalId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request retrieved successfully",
    data: result,
  });
});

const cancelRentalRequest = catchAsync(async (req, res) => {
  const rentalId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await rentalService.cancelRentalRequest(
    req.user.userId,
    rentalId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request cancelled successfully",
    data: result,
  });
});

const getLandlordRentalRequests = catchAsync(async (req, res) => {
  const result = await rentalService.getLandlordRentalRequests(req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property rental requests retrieved successfully",
    data: result,
  });
});

const updateRentalStatus = catchAsync(async (req, res) => {
  const rentalId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await rentalService.updateRentalStatus(
    req.user.userId,
    rentalId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request status updated successfully",
    data: result,
  });
});

const approveRentalRequest = catchAsync(async (req, res) => {
  const rentalId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await rentalService.approveRentalRequest(
    req.user.userId,
    rentalId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request approved successfully",
    data: result,
  });
});

const rejectRentalRequest = catchAsync(async (req, res) => {
  const rentalId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await rentalService.rejectRentalRequest(
    req.user.userId,
    rentalId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request rejected successfully",
    data: result,
  });
});

const getRentalHistory = catchAsync(async (req, res) => {
  const result = await rentalService.getRentalHistory(req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental history retrieved successfully",
    data: result,
  });
});

export const rentalController = {
  createRentalRequest,
  getMyRentalRequests,
  getSingleRentalRequest,
  cancelRentalRequest,
  getLandlordRentalRequests,
  updateRentalStatus,
  approveRentalRequest,
  rejectRentalRequest,
  getRentalHistory,
};
