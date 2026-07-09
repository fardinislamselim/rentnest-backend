import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const tenantId = req.user!.userId;
  const result = await reviewService.createReview(tenantId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const getReviewsByPropertyId = catchAsync(async (req, res) => {
  const propertyId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await reviewService.getReviewsByPropertyId(propertyId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req, res) => {
  const tenantId = req.user!.userId;
  const reviewId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await reviewService.updateReview(tenantId, reviewId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const tenantId = req.user!.userId;
  const reviewId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const result = await reviewService.deleteReview(tenantId, reviewId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getReviewsByPropertyId,
  updateReview,
  deleteReview,
};
