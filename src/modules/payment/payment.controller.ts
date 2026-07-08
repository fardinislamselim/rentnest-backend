import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPaymentIntent = catchAsync(
  async (req, res, next) => {
    const tenantId = req.user?.userId as string;
    const result = await paymentService.createPaymentIntent(tenantId, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Payment intent created successfully",
      data: result,
    });
  },
);

const confirmPayment = catchAsync(
  async (req, res, next) => {
    const tenantId = req.user?.userId as string;
    const result = await paymentService.confirmPayment(tenantId, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment confirmed successfully",
      data: result,
    });
  },
);

const getMyPayments = catchAsync(
  async (req, res, next) => {
    const tenantId = req.user?.userId as string;
    const result = await paymentService.getMyPayments(tenantId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history fetched successfully",
      data: result,
    });
  },
);

const getPaymentById = catchAsync(
  async (req, res, next) => {
    const tenantId = req.user?.userId as string;
    const { id } = req.params;
    const result = await paymentService.getPaymentById(tenantId, id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details fetched successfully",
      data: result,
    });
  },
);


const paymentSuccessPage = (req: Request, res: Response) => {
  res.status(httpStatus.OK).send(
    `<h2>Payment completed on Stripe ✅</h2>
     <p>Session ID: ${req.query.session_id}</p>
     <p>Now call <code>POST /api/v1/payments/confirm</code> with your <code>paymentId</code> to finalize this in RentNest.</p>`,
  );
};

const paymentCancelPage = (req: Request, res: Response) => {
  res
    .status(httpStatus.OK)
    .send(
      `<h2>Payment cancelled ❌</h2><p>You can try again from the app.</p>`,
    );
};

export const paymentController = {
  createPaymentIntent,
  confirmPayment,
  getMyPayments,
  getPaymentById,
  paymentSuccessPage,
  paymentCancelPage,
};
