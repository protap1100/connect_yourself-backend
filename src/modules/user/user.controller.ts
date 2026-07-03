import { NextFunction, Request, RequestHandler, Response } from "express";
import httpsStatus from "http-status";
import { userServices } from "./user.service";
import { catchAsync } from "../../utilties/catchAsync";
import { sendResponse } from "../../utilties/sendResponse";

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
    // res.status(httpsStatus.CREATED).json({
    //   success: true,
    //   statusCode: httpsStatus.CREATED,
    //   message: "user registered successfully",
    //   data: {
    //     user,
    //   },
    // });

    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.CREATED,
      message: "user Registered Successfully",
      data: { user },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const { accessToken } = req.cookies;
    // console.log(req.user);
    // const verifyUser = jwtUtils.verifyToken(
    //   accessToken,
    //   config.jwt_access_secret as string,
    // );

    // if (typeof verifyUser === "string") {
    //   throw new Error("Invalid token");
    // }

    const profile = await userServices.getMyProfileFromDB(
      req.user?.id as string,
    );

    
    res.send({
      success: true,
      statusCode: httpsStatus.OK,
      message: "User profile fetched successfully",
      data: {
        profile,
      },
    });
  },
);

export const userController = {
  createUser,
  getMyProfile,
};
