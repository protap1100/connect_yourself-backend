import { NextFunction, Request, Response } from "express";
import httpsStatus from "http-status";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(httpsStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: httpsStatus.INTERNAL_SERVER_ERROR,
    message: err.message,
    error: err.stack,
  });
};
