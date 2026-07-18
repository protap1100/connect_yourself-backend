import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilties/catchAsync";

const createCheckoutSession = catchAsync(
  (req: Request, res: Response, next: NextFunction) => {},
);

export const subscriptionController = {
  createCheckoutSession,
};
