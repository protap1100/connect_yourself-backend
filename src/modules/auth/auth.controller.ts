import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilties/catchAsync";
import httpsStatus from "http-status";
import { authService } from "./auth.service";
import { sendResponse } from "../../utilties/sendResponse";

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const loginResult = await authService.loginUser(payload);

    sendResponse(res, {
      success: true,
      message: "User logged successfully",
      statusCode: httpsStatus.OK,
      data: loginResult,
    });
  },
);

export const authController = {
  loginUser,
};
