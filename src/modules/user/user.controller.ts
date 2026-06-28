import { Request, Response } from "express";
import httpsStatus from "http-status";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const user = await userServices.registerUserIntoDB(payload);
    res.status(httpsStatus.CREATED).json({
      success: true,
      statusCode: httpsStatus.CREATED,
      message: "user registered successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(httpsStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpsStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to register user",
      error: (error as Error).message,
    });
  }
};

export const userController = {
  createUser,
};
