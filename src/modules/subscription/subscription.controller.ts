import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilties/catchAsync";
import { sendResponse } from "../../utilties/sendResponse";
import HttpStatus from "http-status";
import { subscriptionService } from "./subscription.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await subscriptionService.createCheckoutSession(
      userId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Checkout Complete",
      data: result,
    });
  },
);

export const subscriptionController = {
  createCheckoutSession,
};
