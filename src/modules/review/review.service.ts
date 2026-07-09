import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload, IUpdateReviewPayload } from "./review.interface";

const createReview = async (
  tenantId: string,
  payload: ICreateReviewPayload,
) => {
  const property = await prisma.property.findUnique({
    where: { id: payload.propertyId },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

  const review = await prisma.review.create({
    data: {
      propertyId: payload.propertyId,
      tenantId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  return review;
};

const getReviewsByPropertyId = async (propertyId: string) => {
  return prisma.review.findMany({
    where: { propertyId },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateReview = async (
  tenantId: string,
  reviewId: string,
  payload: IUpdateReviewPayload,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  if (review.tenantId !== tenantId) {
    throw new AppError(403, "You are not allowed to update this review");
  }

  return prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: payload.rating,
      comment: payload.comment,
    },
  });
};

const deleteReview = async (tenantId: string, reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  if (review.tenantId !== tenantId) {
    throw new AppError(403, "You are not allowed to delete this review");
  }

  return prisma.review.delete({
    where: { id: reviewId },
  });
};

export const reviewService = {
  createReview,
  getReviewsByPropertyId,
  updateReview,
  deleteReview,
};
