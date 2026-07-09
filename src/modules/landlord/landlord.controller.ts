import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { landlordService } from "./landlord.service";

const getDashboard = catchAsync(async (req, res) => {
  const result = await landlordService.getDashboard(req.user.userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Landlord dashboard retrieved successfully",
    data: result,
  });
});

export const landlordController = {
  getDashboard,
};
