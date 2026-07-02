import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilties/catchAsync";
import httpsStatus from "http-status";
import { authService } from "./auth.service";
import { sendResponse } from "../../utilties/sendResponse";

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { accessToken, refreshToken } = await authService.loginUser(payload);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
      success: true,
      message: "User logged successfully",
      statusCode: httpsStatus.OK,
      data: { accessToken, refreshToken },
    });
  },
);

export const authController = {
  loginUser,
};
