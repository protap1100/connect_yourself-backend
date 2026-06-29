import { NextFunction, Request, RequestHandler, Response } from "express";
import httpsStatus from "http-status";
import { userServices } from "./user.service";
import { catchAsync } from "../../utilties/catchAsync";



// const createUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;
//     const user = await userServices.registerUserIntoDB(payload);
//     res.status(httpsStatus.CREATED).json({
//       success: true,
//       statusCode: httpsStatus.CREATED,
//       message: "user registered successfully",
//       data: {
//         user,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(httpsStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       statusCode: httpsStatus.INTERNAL_SERVER_ERROR,
//       message: "Failed to register user",
//       error: (error as Error).message,
//     });
//   }
// };

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  },
);

export const userController = {
  createUser,
};
