import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utilties/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpsStatus from "http-status";
import { catchAsync } from "../../utilties/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

router.post("/register", userController.createUser);
// auth(Role.ADMIN, Role.USER, Role.AUTHOR) is a middleware function that checks if the user has the required role to access the route. If the user does not have the required role, it will return a 403 Forbidden response.
const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken 
    //   ||
    //   req.headers.authorization?.startsWith("Bearer ")
    //     ? req.headers.authorization?.split(" ")[1]
    //     : req.headers.authorization;
    if (!token) {
      throw new Error("You are not logged in! Please log in to get access.");
    }

    const verifyUser = jwtUtils.verifyToken(token, config.jwt_access_secret);
    if (verifyUser.success === false) {
      throw new Error(verifyUser.message || "Invalid token");
    }

    const { email, name, id, role } = verifyUser.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden: You do not have permission to access this resource",
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        name,
        role,
      },
    });

    if (!user) {
      throw new Error("User not found. Please log in again.");
    }

    if (user.activeStatus === "BLOCKED") {
      throw new Error("Your account has been blocked. Please contact support.");
    }
    req.user = { email, name, id, role };
    next();
  });
};

router.get(
  "/me",
  //   (req: Request, res: Response, next: NextFunction) => {
  //     const { accessToken } = req.cookies;

  //     const verifyUser = jwtUtils.verifyToken(
  //       accessToken,
  //       config.jwt_access_secret,
  //     );
  //     if (verifyUser.success === false) {
  //       throw new Error(verifyUser.message || "Invalid token");
  //     }

  //     const { email, name, id, role } = verifyUser.data as JwtPayload;

  //     const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

  //     if (!requiredRoles.includes(role)) {
  //       return res.status(403).json({
  //         success: false,
  //         statusCode: httpsStatus.FORBIDDEN,
  //         message: "You do not have permission to access this resource",
  //       });
  //     }
  //     req.user = { email, name, id, role };
  //     next();
  //   },
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  userController.getMyProfile,
);

export const userRoutes = router;
