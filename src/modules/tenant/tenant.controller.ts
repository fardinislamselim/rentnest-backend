import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { tenantService } from "./tenant.service";

const getDashboard = catchAsync(async (req, res) => {
  const result = await tenantService.getDashboard(req.user.userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tenant dashboard retrieved successfully",
    data: result,
  });
});

export const tenantController = {
  getDashboard,
};
